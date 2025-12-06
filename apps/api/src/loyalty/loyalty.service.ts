import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { LoyaltyPoint } from 'db';
import { LoyaltyTransaction } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { User } from 'db';

@Injectable()
export class LoyaltyService {
  private readonly logger = new Logger(LoyaltyService.name);

  constructor(
    @InjectRepository(LoyaltyPoint)
    private readonly loyaltyPointRepository: Repository<LoyaltyPoint>,
    @InjectRepository(LoyaltyTransaction)
    private readonly loyaltyTransactionRepository: Repository<LoyaltyTransaction>,
    private readonly tenantProvider: TenantProvider,
    private readonly entityManager: EntityManager,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async getOrCreateLoyaltyPointAccount(userId: string): Promise<LoyaltyPoint> {
    let loyaltyAccount = await this.loyaltyPointRepository.findOne({ where: { userId, tenantId: this.tenantId } });
    if (!loyaltyAccount) {
      loyaltyAccount = this.loyaltyPointRepository.create({
        userId,
        tenantId: this.tenantId,
        balance: 0,
        lifetimePoints: 0,
      });
      await this.loyaltyPointRepository.save(loyaltyAccount);
      this.logger.log(`Created new loyalty account for user ${userId} in tenant ${this.tenantId}`);
    }
    return loyaltyAccount;
  }

  async awardPoints(
    userId: string,
    points: number,
    transactionType: string,
    description: string,
    referenceId?: string,
    orderId?: string,
  ): Promise<LoyaltyTransaction> {
    if (points <= 0) {
      throw new BadRequestException('Points to award must be positive.');
    }

    return this.entityManager.transaction(async transactionalEntityManager => {
      const loyaltyAccount = await transactionalEntityManager
        .createQueryBuilder(LoyaltyPoint, 'lp')
        .setLock('for_update')
        .where('lp.userId = :userId', { userId })
        .andWhere('lp.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!loyaltyAccount) {
        throw new NotFoundException(`Loyalty account not found for user ${userId}.`);
      }

      loyaltyAccount.balance += points;
      loyaltyAccount.lifetimePoints += points;
      await transactionalEntityManager.save(loyaltyAccount);

      const transaction = transactionalEntityManager.create(LoyaltyTransaction, {
        loyaltyPointId: loyaltyAccount.id,
        tenantId: this.tenantId,
        points,
        transactionType,
        description,
        status: 'completed',
        referenceId,
        orderId,
      });
      await transactionalEntityManager.save(transaction);
      this.logger.log(`Awarded ${points} points to user ${userId}. New balance: ${loyaltyAccount.balance}`);
      return transaction;
    });
  }

  async redeemPoints(
    userId: string,
    points: number,
    transactionType: string,
    description: string,
    referenceId?: string,
    orderId?: string,
  ): Promise<LoyaltyTransaction> {
    if (points <= 0) {
      throw new BadRequestException('Points to redeem must be positive.');
    }

    return this.entityManager.transaction(async transactionalEntityManager => {
      const loyaltyAccount = await transactionalEntityManager
        .createQueryBuilder(LoyaltyPoint, 'lp')
        .setLock('for_update')
        .where('lp.userId = :userId', { userId })
        .andWhere('lp.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!loyaltyAccount) {
        throw new NotFoundException(`Loyalty account not found for user ${userId}.`);
      }
      if (loyaltyAccount.balance < points) {
        throw new BadRequestException('Insufficient loyalty points balance.');
      }

      loyaltyAccount.balance -= points;
      await transactionalEntityManager.save(loyaltyAccount);

      const transaction = transactionalEntityManager.create(LoyaltyTransaction, {
        loyaltyPointId: loyaltyAccount.id,
        tenantId: this.tenantId,
        points: -points, // Store as negative for redemption
        transactionType,
        description,
        status: 'completed',
        referenceId,
        orderId,
      });
      await transactionalEntityManager.save(transaction);
      this.logger.log(`Redeemed ${points} points from user ${userId}. New balance: ${loyaltyAccount.balance}`);
      return transaction;
    });
  }

  async getUserLoyaltyPoints(userId: string): Promise<LoyaltyPoint> {
    const loyaltyAccount = await this.loyaltyPointRepository.findOne({
      where: { userId, tenantId: this.tenantId },
      relations: ['transactions'],
      order: { transactions: { createdAt: 'DESC' } },
    });
    if (!loyaltyAccount) {
      throw new NotFoundException(`Loyalty account not found for user ${userId}.`);
    }
    return loyaltyAccount;
  }

  async getLoyaltyTransactions(userId: string): Promise<LoyaltyTransaction[]> {
    const loyaltyAccount = await this.loyaltyPointRepository.findOne({ where: { userId, tenantId: this.tenantId } });
    if (!loyaltyAccount) {
      throw new NotFoundException(`Loyalty account not found for user ${userId}.`);
    }
    return this.loyaltyTransactionRepository.find({
      where: { loyaltyPointId: loyaltyAccount.id, tenantId: this.tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  // TODO: Implement point expiry logic (e.g., a cron job)
  // TODO: Implement earning rules (e.g., points per dollar spent, bonus points for specific products/categories)
  // These rules would typically be defined in TenantConfig or a separate entity.
  async calculatePointsEarnedForOrder(orderId: string): Promise<number> {
    // For MVP, a simple calculation. In a real system, this would be complex.
    const order = await this.entityManager.getRepository(Order).findOne({ where: { id: orderId, tenantId: this.tenantId } });
    if (!order) {
        return 0;
    }
    const pointsPerDollar = 1; // Example: 1 point per 1 dollar
    return Math.floor(order.totalAmount * pointsPerDollar);
  }
}