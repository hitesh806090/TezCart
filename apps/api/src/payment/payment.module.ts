import { Module, Logger, Injectable } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from 'db';
import { TenantModule } from '../common/tenant.module';
import { OrderModule } from '../order/order.module';
import { AuditModule } from '../audit/audit.module';
import { v4 as uuidv4 } from 'uuid'; // For MockPaymentGatewayService
import { WalletModule } from '../wallet/wallet.module'; // Import WalletModule

// --- Payment Gateway Abstraction ---
export interface PaymentGatewayService {
  createPaymentIntent(amount: number, currency: string, orderId: string, metadata: any): Promise<any>;
  processPayment(paymentIntentId: string, paymentMethodId: string): Promise<any>;
  handleWebhook(payload: any, signature: string): Promise<any>;
  refund(paymentId: string, amount: number): Promise<any>;
}

// Mock/Placeholder Implementation for MVP
@Injectable()
export class MockPaymentGatewayService implements PaymentGatewayService {
  private readonly logger = new Logger(MockPaymentGatewayService.name);

  async createPaymentIntent(amount: number, currency: string, orderId: string, metadata: any): Promise<any> {
    this.logger.log(`Mock: Creating payment intent for Order ${orderId}, Amount ${amount} ${currency}`);
    return {
      id: `pi_mock_${uuidv4()}`,
      status: 'requires_payment_method',
      client_secret: `cs_mock_${uuidv4()}`,
      amount: amount,
      currency: currency,
      metadata: metadata,
      payment_method_options: {
        card: {
          installments: {
            enabled: false,
          },
        },
      },
      next_action: {
        type: "redirect_to_url",
        redirect_to_url: {
          url: `http://mock-gateway.com/pay?pi_id=pi_mock_${uuidv4()}`,
        },
      },
    };
  }

  async processPayment(paymentIntentId: string, paymentMethodId: string): Promise<any> {
    this.logger.log(`Mock: Processing payment ${paymentIntentId} with method ${paymentMethodId}`);
    return {
      id: paymentIntentId,
      status: 'succeeded',
      charges: [{ id: `ch_mock_${uuidv4()}`, status: 'succeeded' }],
    };
  }

  async handleWebhook(payload: any, signature: string): Promise<any> {
    this.logger.log(`Mock: Handling webhook. Payload: ${JSON.stringify(payload)}, Signature: ${signature}`);
    if (payload.type === 'payment.succeeded' || payload.type === 'payment.failed') {
      return {
        type: payload.type,
        data: {
          id: payload.data.id,
          status: payload.type === 'payment.succeeded' ? 'succeeded' : 'failed',
        },
      };
    } else if (payload.type === 'payment.refunded') {
      return {
        type: payload.type,
        data: {
          id: payload.data.id, // This should be original transaction ID
          refund_id: `re_mock_${uuidv4()}`, // Refund ID
          amount: payload.data.amount,
          status: 'succeeded',
        }
      }
    }
    return { received: true, event: payload.type };
  }

  async refund(paymentId: string, amount: number): Promise<any> {
    this.logger.log(`Mock: Refunding payment ${paymentId}, Amount ${amount}`);
    return { id: `re_mock_${uuidv4()}`, status: 'succeeded', amount: amount, paymentId: paymentId };
  }
}
// --- End Payment Gateway Abstraction ---

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    TenantModule,
    OrderModule,
    AuditModule,
    WalletModule, // Add WalletModule
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'PAYMENT_GATEWAY_SERVICE',
      useClass: MockPaymentGatewayService,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}