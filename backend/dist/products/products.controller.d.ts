import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: any): Promise<import("../entities/product.entity").Product>;
    findAll(query: ProductQueryDto): Promise<{
        data: import("../entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    getFeatured(limit?: string): Promise<import("../entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../entities/product.entity").Product>;
    getRelated(id: string, limit?: string): Promise<import("../entities/product.entity").Product[]>;
    findBySlug(slug: string): Promise<import("../entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto, req: any): Promise<import("../entities/product.entity").Product>;
    remove(id: string, req: any): Promise<void>;
    updateStock(id: string, quantity: number): Promise<import("../entities/product.entity").Product>;
}
