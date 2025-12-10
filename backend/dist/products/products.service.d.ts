import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
export declare class ProductsService {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    private generateSlug;
    create(createProductDto: CreateProductDto, sellerId: string): Promise<Product>;
    findAll(query: ProductQueryDto): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Product>;
    findBySlug(slug: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string, userRole: string): Promise<Product>;
    remove(id: string, userId: string, userRole: string): Promise<void>;
    incrementViewCount(id: string): Promise<void>;
    updateStock(id: string, quantity: number): Promise<Product>;
    decrementStock(id: string, quantity: number): Promise<Product>;
    getFeaturedProducts(limit?: number): Promise<Product[]>;
    getRelatedProducts(productId: string, limit?: number): Promise<Product[]>;
}
