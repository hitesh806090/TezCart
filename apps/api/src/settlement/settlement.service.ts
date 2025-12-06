import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { SellerService } from '../seller/seller.service'; // To get seller profile
import { OrderService } from '../order/order.service'; // To get seller orders
import { SellerProfile } from 'db'; // Import SellerProfile entity

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    private readonly tenantProvider: TenantProvider,
    private readonly sellerService: SellerService,
    private readonly orderService: OrderService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  // --- Bank Account Management for Seller ---
  async updateSellerBankAccount(userId: string, bankAccountName: string, bankAccountNumber: string, ifscCode: string): Promise<SellerProfile> {
    const sellerProfile = await this.sellerService.getSellerProfile(userId); // Ensures user is a seller
    
    sellerProfile.bankAccountName = bankAccountName;
    sellerProfile.bankAccountNumber = bankAccountNumber;
    sellerProfile.ifscCode = ifscCode;
    // Update status to 'pending' for re-verification if needed
    // sellerProfile.status = 'bank_details_pending_verification'; 

    return this.sellerService.updateSellerProfile(userId, sellerProfile); // Use the existing update method in SellerService
  }

  // --- Payout History for Seller ---
  async getSellerPayoutHistory(sellerId: string, startDate?: Date, endDate?: Date): Promise<Payout[]> {
    const queryBuilder = this.payoutRepository.createQueryBuilder('payout')
      .where('payout.sellerId = :sellerId', { sellerId })
      .andWhere('payout.tenantId = :tenantId', { tenantId: this.tenantId });

    if (startDate) {
      queryBuilder.andWhere('payout.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('payout.createdAt <= :endDate', { endDate });
    }

    return queryBuilder.orderBy('payout.createdAt', 'DESC').getMany();
  }

  // --- Payout Calculation (Simplified for MVP) ---
  // In a real system, this would be a complex cron job
  // that aggregates orders, applies commissions, deductions, and generates a Payout record.
  async calculateAndCreatePayout(sellerId: string, periodStart: Date, periodEnd: Date): Promise<Payout> {
    this.logger.log(`Calculating payout for seller ${sellerId} from ${periodStart} to ${periodEnd}`);

    const sellerOrders = await this.orderService.findSellerOrders(sellerId);
    const eligibleOrders = sellerOrders.filter(order =>
      (order.status === 'delivered' || order.status === 'shipped') &&
      order.createdAt >= periodStart && order.createdAt <= periodEnd
    );

    const totalRevenue = eligibleOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const commissionRate = 0.10; // Mock 10% commission
    const commission = totalRevenue * commissionRate;
    const netPayoutAmount = totalRevenue - commission;

    const sellerProfile = await this.sellerService.getSellerProfile(sellerId);

    if (!sellerProfile.bankAccountNumber || !sellerProfile.ifscCode) {
        throw new BadRequestException('Seller bank account details are missing for payout.');
    }

    const newPayout = this.payoutRepository.create({
      sellerId,
      tenantId: this.tenantId,
      amount: netPayoutAmount,
      currency: 'INR', // Assuming INR for MVP
      bankAccountName: sellerProfile.bankAccountName,
      bankAccountNumber: sellerProfile.bankAccountNumber,
      bankIfscCode: sellerProfile.ifscCode,
      status: 'pending', // Will be marked 'processed' by a separate system
      orderBreakdown: eligibleOrders.map(order => ({ orderId: order.id, total: order.totalAmount })),
      feeBreakdown: { commission: commission, rate: commissionRate },
    });

    return this.payoutRepository.save(newPayout);
  }
}