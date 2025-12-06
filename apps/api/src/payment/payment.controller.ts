import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'db';

class CreatePaymentIntentDto {
  orderId: string;
  amount: number;
  currency: string;
  gateway: string; // e.g., 'razorpay', 'stripe'
  paymentMethod: string; // e.g., 'card', 'upi', 'cod'
}

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async initiatePayment(@Body() createIntentDto: CreatePaymentIntentDto, @Request() req: { user: User }) {
    if (createIntentDto.paymentMethod === 'cod') {
        return this.paymentService.createCodPayment(
            createIntentDto.orderId,
            req.user.id,
            createIntentDto.amount,
            createIntentDto.currency,
        );
    } else {
        return this.paymentService.createPaymentIntent(
            createIntentDto.orderId,
            req.user.id,
            createIntentDto.amount,
            createIntentDto.currency,
            createIntentDto.gateway,
            createIntentDto.paymentMethod,
        );
    }
  }

  // Webhook endpoint for payment gateways to send updates
  @Post('webhook/:gateway')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('gateway') gateway: string,
    @Body() payload: any,
    @Headers('stripe-signature') stripeSignature?: string, // Example for Stripe
    @Headers('x-razorpay-signature') razorpaySignature?: string, // Example for Razorpay
  ) {
    let signature: string | undefined;
    if (gateway === 'stripe') {
      signature = stripeSignature;
    } else if (gateway === 'razorpay') {
      signature = razorpaySignature;
    }
    return this.paymentService.processPaymentWebhook(gateway, payload, signature);
  }
}
