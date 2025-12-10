import { SellersService } from './sellers.service';
import { CreateSellerDto, UpdateSellerDto, ApproveSellerDto, RejectSellerDto } from './dto/seller.dto';
import { SellerStatus } from '../entities/seller.entity';
export declare class SellersController {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    create(createSellerDto: CreateSellerDto, req: any): Promise<import("../entities/seller.entity").Seller>;
    findAll(status?: SellerStatus): Promise<import("../entities/seller.entity").Seller[]>;
    getMyShop(req: any): Promise<import("../entities/seller.entity").Seller>;
    findBySlug(slug: string): Promise<import("../entities/seller.entity").Seller>;
    findOne(id: string): Promise<import("../entities/seller.entity").Seller>;
    getStats(id: string): Promise<any>;
    update(id: string, updateSellerDto: UpdateSellerDto, req: any): Promise<import("../entities/seller.entity").Seller>;
    approve(id: string, approveDto: ApproveSellerDto): Promise<import("../entities/seller.entity").Seller>;
    reject(id: string, rejectDto: RejectSellerDto): Promise<import("../entities/seller.entity").Seller>;
    suspend(id: string, reason: string): Promise<import("../entities/seller.entity").Seller>;
    activate(id: string): Promise<import("../entities/seller.entity").Seller>;
}
