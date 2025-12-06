import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from 'db';
import { UserBadge } from 'db';
import { Mission } from 'db';
import { UserMission } from 'db';
import { Referral } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { UserService } from '..//user/user.service';
import { LoyaltyService } from './loyalty.service'; // For awarding points as rewards
import { v4 as uuidv4 } from 'uuid'; // For generating referral codes

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>,
    @InjectRepository(UserMission)
    private readonly userMissionRepository: Repository<UserMission>,
    @InjectRepository(Referral)
    private readonly referralRepository: Repository<Referral>,
    private readonly tenantProvider: TenantProvider,
    private readonly userService: UserService,
    private readonly loyaltyService: LoyaltyService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  // --- Badge Management ---
  async createBadge(badgeData: Partial<Badge>): Promise<Badge> {
    const existingBadge = await this.badgeRepository.findOne({ where: { slug: badgeData.slug, tenantId: this.tenantId } });
    if (existingBadge) {
      throw new ConflictException(`Badge with slug '${badgeData.slug}' already exists.`);
    }
    const newBadge = this.badgeRepository.create({ ...badgeData, tenantId: this.tenantId });
    return this.badgeRepository.save(newBadge);
  }

  async awardBadgeToUser(userId: string, badgeId: string, reason: string = 'Manual award'): Promise<UserBadge> {
    const user = await this.userService.findUserById(userId);
    const badge = await this.badgeRepository.findOne({ where: { id: badgeId, tenantId: this.tenantId } });
    if (!badge) {
      throw new NotFoundException('Badge not found.');
    }
    const existingUserBadge = await this.userBadgeRepository.findOne({ where: { userId, badgeId, tenantId: this.tenantId } });
    if (existingUserBadge) {
      throw new ConflictException('User already has this badge.');
    }

    const userBadge = this.userBadgeRepository.create({
      userId,
      badgeId,
      tenantId: this.tenantId,
      awardedAt: new Date(),
      reason,
    });
    // TODO: Award rewards associated with badge (loyalty points, coupons)
    return this.userBadgeRepository.save(userBadge);
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return this.userBadgeRepository.find({ where: { userId, tenantId: this.tenantId }, relations: ['badge'] });
  }

  // --- Mission Management ---
  async createMission(missionData: Partial<Mission>): Promise<Mission> {
    const existingMission = await this.missionRepository.findOne({ where: { slug: missionData.slug, tenantId: this.tenantId } });
    if (existingMission) {
      throw new ConflictException(`Mission with slug '${missionData.slug}' already exists.`);
    }
    const newMission = this.missionRepository.create({ ...missionData, tenantId: this.tenantId });
    return this.missionRepository.save(newMission);
  }

  async getUserMissions(userId: string): Promise<UserMission[]> {
    return this.userMissionRepository.find({ where: { userId, tenantId: this.tenantId }, relations: ['mission'] });
  }

  async startMission(userId: string, missionId: string): Promise<UserMission> {
    const mission = await this.missionRepository.findOne({ where: { id: missionId, tenantId: this.tenantId } });
    if (!mission) {
      throw new NotFoundException('Mission not found.');
    }
    const existingUserMission = await this.userMissionRepository.findOne({ where: { userId, missionId, tenantId: this.tenantId } });
    if (existingUserMission) {
      throw new ConflictException('User already started this mission.');
    }
    if (mission.validFrom > new Date() || mission.validUntil < new Date()) {
      throw new BadRequestException('Mission is not currently active.');
    }

    const userMission = this.userMissionRepository.create({
      userId,
      missionId,
      tenantId: this.tenantId,
      status: 'in_progress',
      progress: {}, // Initialize empty progress
    });
    return this.userMissionRepository.save(userMission);
  }

  // TODO: Method to update mission progress (e.g., on order completion, product review)
  // TODO: Method to check mission completion and award rewards

  // --- Referral Management ---
  async createReferral(referrerId: string, referralCode?: string): Promise<Referral> {
    const user = await this.userService.findUserById(referrerId);
    if (!user) {
      throw new NotFoundException('Referrer not found.');
    }

    const existingReferral = await this.referralRepository.findOne({ where: { referrerId, tenantId: this.tenantId } });
    if (existingReferral) {
        return existingReferral; // User already has a referral code
    }

    const newReferralCode = referralCode || `REF-${uuidv4().substring(0, 8).toUpperCase()}`;
    const referral = this.referralRepository.create({
      referrerId,
      referralCode: newReferralCode,
      tenantId: this.tenantId,
      status: 'pending',
    });
    return this.referralRepository.save(referral);
  }

  async processReferredUserSignup(referredUserId: string, referralCode: string): Promise<Referral> {
    const referredUser = await this.userService.findUserById(referredUserId);
    if (!referredUser) {
      throw new NotFoundException('Referred user not found.');
    }
    const referral = await this.referralRepository.findOne({ where: { referralCode, tenantId: this.tenantId } });
    if (!referral) {
      throw new NotFoundException('Invalid referral code.');
    }
    if (referral.referrerId === referredUserId) {
      throw new BadRequestException('Cannot refer oneself.');
    }
    if (referral.referredUserId) {
        throw new ConflictException('Referral code already used.');
    }

    referral.referredUserId = referredUserId;
    referral.status = 'qualified'; // Qualified for reward after first purchase, etc.
    // TODO: Award initial rewards (e.g., points to referred user)
    return this.referralRepository.save(referral);
  }

  async getReferralStatus(userId: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({ where: { referrerId: userId, tenantId: this.tenantId } });
    if (!referral) {
        throw new NotFoundException('Referral data not found for this user.');
    }
    return referral;
  }
}
