import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller, SellerStatus } from '../entities/seller.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { CreateSellerDto, UpdateSellerDto, ApproveSellerDto, RejectSellerDto } from './dto/seller.dto';

@Injectable()
export class SellersService {
    constructor(
        @InjectRepository(Seller)
        private sellersRepository: Repository<Seller>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    async create(createSellerDto: CreateSellerDto, userId: string): Promise<Seller> {
        // Check if user already has a seller account
        const existing = await this.sellersRepository.findOne({ where: { userId } });

        if (existing) {
            throw new ConflictException('User already has a seller account');
        }

        // Check shop name uniqueness
        const shopExists = await this.sellersRepository.findOne({
            where: { shopName: createSellerDto.shopName },
        });

        if (shopExists) {
            throw new ConflictException('Shop name already taken');
        }

        // Generate shop slug
        const shopSlug = createSellerDto.shopName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const seller = this.sellersRepository.create({
            ...createSellerDto,
            userId,
            shopSlug,
            status: SellerStatus.PENDING,
        });

        return this.sellersRepository.save(seller);
    }

    async findAll(status?: SellerStatus): Promise<Seller[]> {
        const query: any = {};

        if (status) {
            query.status = status;
        }

        return this.sellersRepository.find({
            where: query,
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Seller> {
        const seller = await this.sellersRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!seller) {
            throw new NotFoundException('Seller not found');
        }

        return seller;
    }

    async findByUserId(userId: string): Promise<Seller | null> {
        return this.sellersRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
    }

    async findBySlug(slug: string): Promise<Seller> {
        const seller = await this.sellersRepository.findOne({
            where: { shopSlug: slug },
            relations: ['user'],
        });

        if (!seller) {
            throw new NotFoundException('Seller not found');
        }

        return seller;
    }

    async update(id: string, updateSellerDto: UpdateSellerDto, userId: string): Promise<Seller> {
        const seller = await this.findOne(id);

        // Verify ownership
        if (seller.userId !== userId) {
            throw new BadRequestException('You do not own this seller account');
        }

        // Update slug if shop name changed
        if (updateSellerDto.shopName && updateSellerDto.shopName !== seller.shopName) {
            const shopExists = await this.sellersRepository.findOne({
                where: { shopName: updateSellerDto.shopName },
            });

            if (shopExists && shopExists.id !== id) {
                throw new ConflictException('Shop name already taken');
            }

            seller.shopSlug = updateSellerDto.shopName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        Object.assign(seller, updateSellerDto);

        return this.sellersRepository.save(seller);
    }

    async approve(id: string, approveDto: ApproveSellerDto): Promise<Seller> {
        const seller = await this.findOne(id);

        if (seller.status === SellerStatus.APPROVED) {
            throw new BadRequestException('Seller already approved');
        }

        seller.status = SellerStatus.APPROVED;
        seller.approvedAt = new Date();

        if (approveDto.commissionRate !== undefined) {
            seller.commissionRate = approveDto.commissionRate;
        }

        return this.sellersRepository.save(seller);
    }

    async reject(id: string, rejectDto: RejectSellerDto): Promise<Seller> {
        const seller = await this.findOne(id);

        seller.status = SellerStatus.REJECTED;
        seller.rejectionReason = rejectDto.reason;

        return this.sellersRepository.save(seller);
    }

    async suspend(id: string, reason: string): Promise<Seller> {
        const seller = await this.findOne(id);

        seller.status = SellerStatus.SUSPENDED;
        seller.isActive = false;
        seller.rejectionReason = reason;

        return this.sellersRepository.save(seller);
    }

    async activate(id: string): Promise<Seller> {
        const seller = await this.findOne(id);

        if (seller.status !== SellerStatus.APPROVED) {
            throw new BadRequestException('Seller must be approved first');
        }

        seller.isActive = true;

        return this.sellersRepository.save(seller);
    }

    async getStats(sellerId: string): Promise<any> {
        const seller = await this.findOne(sellerId);

        // Get product stats
        const products = await this.productsRepository.find({
            where: { sellerId: seller.userId },
        });

        // Get order stats
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .leftJoin('order.items', 'items')
            .where('items.sellerId = :sellerId', { sellerId: seller.userId })
            .getMany();

        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalOrders = orders.length;

        return {
            seller,
            totalProducts: products.length,
            activeProducts: products.filter(p => p.status === 'active').length,
            totalOrders,
            totalRevenue,
            averageRating: seller.rating,
            totalReviews: seller.totalReviews,
        };
    }

    async getMyShop(userId: string): Promise<Seller> {
        const seller = await this.findByUserId(userId);

        if (!seller) {
            throw new NotFoundException('You do not have a seller account');
        }

        return seller;
    }
}
