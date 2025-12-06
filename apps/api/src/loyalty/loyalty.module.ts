import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';
import { GamificationService } from './gamification.service'; // Import GamificationService
import { GamificationController } from './gamification.controller'; // Import GamificationController
import { LoyaltyPoint } from 'db';
import { LoyaltyTransaction } from 'db';
import { Badge } from 'db'; // Import Badge entity
import { UserBadge } from 'db'; // Import UserBadge entity
import { Mission } from 'db'; // Import Mission entity
import { UserMission } from 'db'; // Import UserMission entity
import { Referral } from 'db'; // Import Referral entity
import { TenantModule } from '../common/tenant.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoyaltyPoint, LoyaltyTransaction, Badge, UserBadge, Mission, UserMission, Referral]), // Add all new entities
    TenantModule,
    UserModule,
  ],
  controllers: [LoyaltyController, GamificationController], // Add GamificationController
  providers: [LoyaltyService, GamificationService], // Add GamificationService
  exports: [LoyaltyService, GamificationService], // Export both services
})
export class LoyaltyModule {}
