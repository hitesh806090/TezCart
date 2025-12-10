import { Repository } from 'typeorm';
import { Seller, SellerStatus } from '../entities/seller.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { CreateSellerDto, UpdateSellerDto, ApproveSellerDto, RejectSellerDto } from './dto/seller.dto';
export declare class SellersService {
    private sellersRepository;
    private productsRepository;
    private ordersRepository;
    constructor(sellersRepository: Repository<Seller>, productsRepository: Repository<Product>, ordersRepository: Repository<Order>);
    create(createSellerDto: CreateSellerDto, userId: string): Promise<Seller>;
    findAll(status?: SellerStatus): Promise<Seller[]>;
    findOne(id: string): Promise<Seller>;
    findByUserId(userId: string): Promise<Seller | null>;
    findBySlug(slug: string): Promise<Seller>;
    update(id: string, updateSellerDto: UpdateSellerDto, userId: string): Promise<Seller>;
    approve(id: string, approveDto: ApproveSellerDto): Promise<Seller>;
    reject(id: string, rejectDto: RejectSellerDto): Promise<Seller>;
    suspend(id: string, reason: string): Promise<Seller>;
    activate(id: string): Promise<Seller>;
    getStats(sellerId: string): Promise<any>;
    getMyShop(userId: string): Promise<Seller>;
}
