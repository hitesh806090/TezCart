import { PaymentsService } from './payments.service';
import { CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(createPaymentDto: CreatePaymentDto, req: any): Promise<import("../entities/payment.entity").Payment>;
    processPayment(processPaymentDto: ProcessPaymentDto, req: any): Promise<import("../entities/payment.entity").Payment>;
    refundPayment(id: string, refundDto: RefundPaymentDto): Promise<import("../entities/payment.entity").Payment>;
    getUserPayments(req: any): Promise<import("../entities/payment.entity").Payment[]>;
    getPaymentsByOrder(orderId: string): Promise<import("../entities/payment.entity").Payment[]>;
    getPaymentById(id: string, req: any): Promise<import("../entities/payment.entity").Payment>;
}
