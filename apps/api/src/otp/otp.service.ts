import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface OtpRecord {
  otp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  userId?: string; // Optional: associate with a user
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  // Using an in-memory store for MVP. In production, this would be Redis.
  private otpStore: Map<string, OtpRecord> = new Map();

  constructor(private readonly configService: ConfigService) {}

  generateOtp(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  async sendOtp(identifier: string, userId?: string, purpose?: string): Promise<string> {
    const otpLength = this.configService.get<number>('OTP_LENGTH') || 6;
    const otpTtlSeconds = this.configService.get<number>('OTP_TTL_SECONDS') || 300; // 5 minutes
    const maxAttempts = this.configService.get<number>('OTP_MAX_ATTEMPTS') || 3;

    let otpRecord = this.otpStore.get(identifier);

    // Prevent sending too frequently for the same identifier
    if (otpRecord && otpRecord.createdAt + (60 * 1000) > Date.now()) { // 1 minute cooldown
        throw new ConflictException('Please wait before requesting another OTP.');
    }

    const otp = this.generateOtp(otpLength);
    const createdAt = Date.now();
    const expiresAt = createdAt + otpTtlSeconds * 1000;

    otpRecord = { otp, createdAt, expiresAt, attempts: 0, userId };
    this.otpStore.set(identifier, otpRecord);

    // Simulate sending OTP via SMS/Email
    this.logger.log(`OTP for ${identifier} (${purpose || 'general'}): ${otp} (expires in ${otpTtlSeconds}s)`);

    // In a real app, integrate with SMS/Email provider here.
    // e.g., this.smsService.send(identifier, `Your OTP is ${otp}`);

    return otp;
  }

  async verifyOtp(identifier: string, otp: string): Promise<boolean> {
    const otpRecord = this.otpStore.get(identifier);
    if (!otpRecord) {
      this.logger.warn(`OTP not found for identifier: ${identifier}`);
      return false;
    }

    if (otpRecord.expiresAt < Date.now()) {
      this.otpStore.delete(identifier); // OTP expired
      this.logger.warn(`OTP expired for identifier: ${identifier}`);
      return false;
    }

    otpRecord.attempts++;
    this.otpStore.set(identifier, otpRecord); // Update attempts count

    const maxAttempts = this.configService.get<number>('OTP_MAX_ATTEMPTS') || 3;
    if (otpRecord.attempts > maxAttempts) {
        this.otpStore.delete(identifier); // Too many attempts
        this.logger.warn(`Too many OTP attempts for identifier: ${identifier}`);
        throw new BadRequestException('Too many OTP attempts. Please request a new OTP.');
    }

    if (otpRecord.otp === otp) {
      this.otpStore.delete(identifier); // OTP successfully verified, remove it
      this.logger.log(`OTP verified successfully for identifier: ${identifier}`);
      return true;
    } else {
      this.logger.warn(`Invalid OTP for identifier: ${identifier}`);
      return false;
    }
  }

  // Clear expired OTPs periodically (e.g., using a cron job)
  clearExpiredOtps() {
    const now = Date.now();
    for (const [identifier, record] of this.otpStore.entries()) {
      if (record.expiresAt < now) {
        this.otpStore.delete(identifier);
        this.logger.debug(`Cleared expired OTP for ${identifier}`);
      }
    }
  }
}