import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create payment for order' })
    @ApiResponse({ status: 201, description: 'Payment created successfully' })
    @ApiResponse({ status: 400, description: 'Order already paid or invalid' })
    createPayment(@Body() createPaymentDto: CreatePaymentDto, @Request() req: any) {
        return this.paymentsService.createPayment(createPaymentDto, req.user.userId);
    }

    @Post('process')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Process payment' })
    @ApiResponse({ status: 200, description: 'Payment processed successfully' })
    processPayment(@Body() processPaymentDto: ProcessPaymentDto, @Request() req: any) {
        return this.paymentsService.processPayment(processPaymentDto, req.user.userId);
    }

    @Post(':id/refund')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refund payment (Admin only)' })
    @ApiParam({ name: 'id', description: 'Payment ID' })
    @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
    refundPayment(@Param('id') id: string, @Body() refundDto: RefundPaymentDto) {
        return this.paymentsService.refundPayment(id, refundDto);
    }

    @Get('my-payments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my payments' })
    @ApiResponse({ status: 200, description: 'Returns user payments' })
    getUserPayments(@Request() req: any) {
        return this.paymentsService.getUserPayments(req.user.userId);
    }

    @Get('order/:orderId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get payments for order' })
    @ApiParam({ name: 'orderId', description: 'Order ID' })
    @ApiResponse({ status: 200, description: 'Returns order payments' })
    getPaymentsByOrder(@Param('orderId') orderId: string) {
        return this.paymentsService.getPaymentsByOrder(orderId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get payment by ID' })
    @ApiParam({ name: 'id', description: 'Payment ID' })
    @ApiResponse({ status: 200, description: 'Returns payment details' })
    getPaymentById(@Param('id') id: string, @Request() req: any) {
        return this.paymentsService.getPaymentById(id, req.user.userId);
    }
}
