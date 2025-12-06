import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RoutingController } from './routing.controller';
import { ConfigModule } from '@nestjs/config'; // For accessing API keys if integrated with external services

@Module({
  imports: [ConfigModule],
  controllers: [RoutingController],
  providers: [RoutingService],
  exports: [RoutingService], // Export RoutingService for use by AssignmentService
})
export class RoutingModule {}