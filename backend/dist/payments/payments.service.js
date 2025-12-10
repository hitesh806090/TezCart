"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const order_entity_1 = require("../entities/order.entity");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    ordersRepository;
    constructor(paymentsRepository, ordersRepository) {
        this.paymentsRepository = paymentsRepository;
        this.ordersRepository = ordersRepository;
    }
    async createPayment(createPaymentDto, userId) {
        const order = await this.ordersRepository.findOne({
            where: { id: createPaymentDto.orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('This order does not belong to you');
        }
        if (order.paymentStatus === 'completed') {
            throw new common_1.BadRequestException('Order is already paid');
        }
        const gateway = this.getGatewayForMethod(createPaymentDto.paymentMethod);
        const payment = this.paymentsRepository.create({
            orderId: order.id,
            userId,
            paymentMethod: createPaymentDto.paymentMethod,
            gateway,
            amount: order.totalAmount,
            currency: 'USD',
            status: payment_entity_1.PaymentStatus.PENDING,
        });
        const savedPayment = await this.paymentsRepository.save(payment);
        if (createPaymentDto.paymentMethod === payment_entity_1.PaymentMethod.COD) {
            savedPayment.status = payment_entity_1.PaymentStatus.PROCESSING;
            await this.paymentsRepository.save(savedPayment);
        }
        return savedPayment;
    }
    async processPayment(processPaymentDto, userId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id: processPaymentDto.paymentId },
            relations: ['order'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new common_1.BadRequestException('This payment does not belong to you');
        }
        if (payment.status === payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Payment already completed');
        }
        payment.status = payment_entity_1.PaymentStatus.COMPLETED;
        payment.transactionId = processPaymentDto.transactionId || `TXN-${Date.now()}`;
        payment.paidAt = new Date();
        payment.gatewayResponse = processPaymentDto.gatewayData;
        await this.paymentsRepository.save(payment);
        await this.ordersRepository.update({ id: payment.orderId }, {
            paymentStatus: 'completed',
            paymentTransactionId: payment.transactionId,
            paidAt: payment.paidAt,
        });
        return payment;
    }
    async refundPayment(paymentId, refundDto) {
        const payment = await this.paymentsRepository.findOne({
            where: { id: paymentId },
            relations: ['order'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.status !== payment_entity_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Only completed payments can be refunded');
        }
        if (refundDto.amount > Number(payment.amount)) {
            throw new common_1.BadRequestException('Refund amount exceeds payment amount');
        }
        const totalRefunded = Number(payment.refundedAmount) + refundDto.amount;
        const isFullRefund = totalRefunded >= Number(payment.amount);
        payment.refundedAmount = totalRefunded;
        payment.refundReason = refundDto.reason;
        payment.refundedAt = new Date();
        payment.status = isFullRefund ? payment_entity_1.PaymentStatus.REFUNDED : payment_entity_1.PaymentStatus.PARTIALLY_REFUNDED;
        await this.paymentsRepository.save(payment);
        if (isFullRefund) {
            await this.ordersRepository.update({ id: payment.orderId }, {
                status: order_entity_1.OrderStatus.REFUNDED,
                paymentStatus: 'refunded',
            });
        }
        return payment;
    }
    async getPaymentsByOrder(orderId) {
        return this.paymentsRepository.find({
            where: { orderId },
            order: { createdAt: 'DESC' },
        });
    }
    async getPaymentById(id, userId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['order'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new common_1.BadRequestException('This payment does not belong to you');
        }
        return payment;
    }
    async getUserPayments(userId) {
        return this.paymentsRepository.find({
            where: { userId },
            relations: ['order'],
            order: { createdAt: 'DESC' },
        });
    }
    getGatewayForMethod(method) {
        switch (method) {
            case payment_entity_1.PaymentMethod.CREDIT_CARD:
            case payment_entity_1.PaymentMethod.DEBIT_CARD:
                return payment_entity_1.PaymentGateway.STRIPE;
            case payment_entity_1.PaymentMethod.UPI:
            case payment_entity_1.PaymentMethod.NET_BANKING:
            case payment_entity_1.PaymentMethod.WALLET:
                return payment_entity_1.PaymentGateway.RAZORPAY;
            case payment_entity_1.PaymentMethod.COD:
                return payment_entity_1.PaymentGateway.MANUAL;
            default:
                return payment_entity_1.PaymentGateway.STRIPE;
        }
    }
    async handleWebhook(gateway, payload) {
        console.log(`Received webhook from ${gateway}:`, payload);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map