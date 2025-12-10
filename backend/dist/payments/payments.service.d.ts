import { Repository } from 'typeorm';
import { Payment, PaymentGateway } from '../entities/payment.entity';
import { Order } from '../entities/order.entity';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto } from './dto/payment.dto';
export declare class PaymentsService {
    private paymentsRepository;
    private ordersRepository;
    constructor(paymentsRepository: Repository<Payment>, ordersRepository: Repository<Order>);
    createPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment>;
    processPayment(processPaymentDto: ProcessPaymentDto, userId: string): Promise<Payment>;
    refundPayment(paymentId: string, refundDto: RefundPaymentDto): Promise<Payment>;
    getPaymentsByOrder(orderId: string): Promise<Payment[]>;
    getPaymentById(id: string, userId: string): Promise<Payment>;
    getUserPayments(userId: string): Promise<Payment[]>;
    private getGatewayForMethod;
    handleWebhook(gateway: PaymentGateway, payload: any): Promise<void>;
}
