import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Product } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { ProductService } from '..//product/product.service'; // Import ProductService

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly tenantProvider: TenantProvider,
    private readonly productService: ProductService, // Inject ProductService
    private readonly entityManager: EntityManager, // Inject EntityManager for transactions
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async updateStock(productId: string, quantityChange: number, sellerId: string): Promise<Product> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const product = await transactionalEntityManager
        .createQueryBuilder(Product, 'product')
        .setLock('for_update') // pessimistic lock
        .where('product.id = :productId', { productId })
        .andWhere('product.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      // Authorization: ensure seller owns the product or is an admin
      if (product.sellerId !== sellerId) {
          throw new BadRequestException('You are not authorized to update inventory for this product.');
      }

      const newStock = product.stock + quantityChange;
      if (newStock < 0) {
        throw new BadRequestException('Stock cannot be negative.');
      }

      product.stock = newStock;
      return transactionalEntityManager.save(product);
    });
  }

  async reserveStock(productId: string, quantity: number): Promise<Product> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const product = await transactionalEntityManager
        .createQueryBuilder(Product, 'product')
        .setLock('for_update') // pessimistic lock
        .where('product.id = :productId', { productId })
        .andWhere('product.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      if (product.stock < quantity) {
        throw new BadRequestException(`Not enough stock available for product ${productId}. Available: ${product.stock}, Requested: ${quantity}`);
      }

      product.stock -= quantity; // Decrement stock for reservation
      // In a more complex system, you might have a separate 'reservedStock' column
      // and move items from 'available' to 'reserved'. For basic, we just deduct.
      return transactionalEntityManager.save(product);
    });
  }

  async releaseStock(productId: string, quantity: number): Promise<Product> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      const product = await transactionalEntityManager
        .createQueryBuilder(Product, 'product')
        .setLock('for_update') // pessimistic lock
        .where('product.id = :productId', { productId })
        .andWhere('product.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found.`);
      }

      product.stock += quantity; // Increment stock
      return transactionalEntityManager.save(product);
    });
  }

  async getStock(productId: string): Promise<{ stock: number }> {
    const product = await this.productService.findProductById(productId); // findProductById is tenant-aware
    return { stock: product.stock };
  }
}