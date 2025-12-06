import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ConfigModule } from '@nestjs/config'; // For accessing config values like OTP length, TTL

@Module({
  imports: [ConfigModule], // Import ConfigModule
  providers: [OtpService],
  exports: [OtpService], // Export OtpService for use by other modules
})
export class OtpModule {}