import { Injectable, NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'db';
import { ProductAlert } from 'db'; // Import ProductAlert
import { TenantProvider } from '..//common/tenant.module';
import { UserService } from '..//user/user.service';
import { CategoryService } from '../category/category.service';
import { SearchService } from '../search/search.service';
import { InventoryService } from '../inventory/inventory.service';
import { NotificationService } from '../notification/notification.service'; // Import NotificationService
import { Readable } from 'stream';
import * as csv from 'csv-parser';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAlert)
    private readonly productAlertRepository: Repository<ProductAlert>, // Inject ProductAlert repository
    private readonly tenantProvider: TenantProvider,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly searchService: SearchService,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService, // Inject NotificationService
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createProduct(productData: Partial<Product>, sellerId: string): Promise<Product> {
    const seller = await this.userService.findUserById(sellerId);
    if (seller.defaultPersona !== 'seller' && seller.defaultPersona !== 'admin' && seller.defaultPersona !== 'super_admin') {
      throw new BadRequestException('Only sellers or admins can create products.');
    }

    if (productData.categoryId) {
      await this.categoryService.findCategoryById(productData.categoryId);
    }

    const existingProduct = await this.productRepository.findOne({
      where: { slug: productData.slug, tenantId: this.tenantId },
    });
    if (existingProduct) {
      throw new ConflictException(`Product with slug '${productData.slug}' already exists for this tenant.`);
    }

    const newProduct = this.productRepository.create({
      ...productData,
      sellerId: seller.id,
      tenantId: this.tenantId,
      status: 'pending_approval',
    });
    const savedProduct = await this.productRepository.save(newProduct);

    await this.searchService.addOrUpdateProduct(savedProduct);

    return savedProduct;
  }

  async bulkCreateProducts(
    csvStream: Readable,
    sellerId: string,
  ): Promise<{ successCount: number; errorCount: number; errors: any[] }> {
    const productsToCreate: Partial<Product>[] = [];
    const errors: any[] = [];

    const seller = await this.userService.findUserById(sellerId);
    if (seller.defaultPersona !== 'seller' && seller.defaultPersona !== 'admin' && seller.defaultPersona !== 'super_admin') {
      throw new UnauthorizedException('Only sellers or admins can bulk upload products.');
    }

    return new Promise((resolve, reject) => {
      csvStream
        .pipe(csv())
        .on('data', (data) => {
          const productData: Partial<Product> = {
            title: data.title,
            slug: data.slug,
            description: data.description,
            price: parseFloat(data.price),
            salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
            imageUrl: data.imageUrl,
            images: data.images ? data.images.split(',') : undefined,
            stock: parseInt(data.stock, 10),
            categoryId: data.categoryId,
            seo: data.seo ? JSON.parse(data.seo) : undefined,
            sellerId: sellerId,
            tenantId: this.tenantId,
            status: 'pending_approval',
          };
          productsToCreate.push(productData);
        })
        .on('end', async () => {
          let successCount = 0;
          for (const productData of productsToCreate) {
            try {
              if (!productData.title || !productData.slug || !productData.price || isNaN(productData.stock)) {
                  throw new BadRequestException('Missing required fields or invalid data in CSV row.');
              }
              const existingProduct = await this.productRepository.findOne({
                where: { slug: productData.slug, tenantId: this.tenantId },
              });
              if (existingProduct) {
                throw new ConflictException(`Product with slug '${productData.slug}' already exists.`);
              }
              if (productData.categoryId) {
                await this.categoryService.findCategoryById(productData.categoryId);
              }

              const newProduct = this.productRepository.create(productData);
              const savedProduct = await this.productRepository.save(newProduct);
              await this.searchService.addOrUpdateProduct(savedProduct);
              successCount++;
            } catch (error) {
              errors.push({ data: productData, error: error.message });
            }
          }
          resolve({ successCount, errorCount: errors.length, errors });
        })
        .on('error', (error) => {
          reject(new BadRequestException(`CSV parsing error: ${error.message}`));
        });
    });
  }

  async findAllProducts(sellerId?: string): Promise<Product[]> {
    const whereCondition: any = { tenantId: this.tenantId };
    if (sellerId) {
      whereCondition.sellerId = sellerId;
    }
    return this.productRepository.find({ where: whereCondition, relations: ['category', 'seller'] });
  }

  async findProductById(id: string): Promise<Product & { currentStock: number }> {
    const product = await this.productRepository.findOne({
      where: { id, tenantId: this.tenantId },
      relations: ['category', 'seller'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    const { stock: currentStock } = await this.inventoryService.getStock(product.id);

    return { ...product, currentStock };
  }

  async updateProduct(id: string, updateData: Partial<Product>, updaterUserId: string): Promise<Product> {
    const product = await this.findProductById(id);

    const updaterUser = await this.userService.findUserById(updaterUserId);
    const isOwner = product.sellerId === updaterUserId;
    const isAdmin = updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin';

    if (!isOwner && !isAdmin) {
        throw new UnauthorizedException('You are not authorized to update this product.');
    }

    if (updateData.categoryId) {
      await this.categoryService.findCategoryById(updateData.categoryId);
    }

    const oldPrice = product.price;
    const oldSalePrice = product.salePrice;
    const oldStock = product.stock;

    this.productRepository.merge(product, updateData);
    const updatedProduct = await this.productRepository.save(product);

    await this.searchService.addOrUpdateProduct(updatedProduct);

    // Check for price drop alerts
    if (oldPrice !== updatedProduct.price || oldSalePrice !== updatedProduct.salePrice) {
      await this.checkAndSendPriceDropAlerts(updatedProduct, oldPrice);
    }
    // Check for back-in-stock alerts
    if (oldStock === 0 && updatedProduct.stock > 0) {
      await this.checkAndSendBackInStockAlerts(updatedProduct);
    }

    return updatedProduct;
  }

  async deleteProduct(id: string, updaterUserId: string): Promise<void> {
    const product = await this.findProductById(id);

    const updaterUser = await this.userService.findUserById(updaterUserId);
    const isOwner = product.sellerId === updaterUserId;
    const isAdmin = updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin';

    if (!isOwner && !isAdmin) {
        throw new UnauthorizedException('You are not authorized to delete this product.');
    }

    const result = await this.productRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found or not owned by tenant/seller.`);
    }

    await this.searchService.deleteProduct(id);
  }

  async updateProductStatus(id: string, newStatus: string, updaterUserId: string): Promise<Product> {
    const product = await this.findProductById(id);

    const updaterUser = await this.userService.findUserById(updaterUserId);
    const isAdmin = updaterUser.defaultPersona === 'admin' || updaterUser.defaultPersona === 'super_admin';

    if (!isAdmin) {
        throw new UnauthorizedException('Only admins can update product status.');
    }

    const oldStock = product.stock; // Capture old stock before update
    product.status = newStatus;
    const updatedProduct = await this.productRepository.save(product);

    await this.searchService.addOrUpdateProduct(updatedProduct);

    // Check for back-in-stock alerts if product status changes to published and stock becomes available
    if (oldStock === 0 && updatedProduct.stock > 0 && newStatus === 'published') {
        await this.checkAndSendBackInStockAlerts(updatedProduct);
    }

    return updatedProduct;
  }


  // --- Product Alert Methods ---
  async subscribeToAlert(userId: string, productId: string, alertType: 'price_drop' | 'back_in_stock', thresholdPrice?: number): Promise<ProductAlert> {
    // Ensure product exists
    const product = await this.productRepository.findOne({ where: { id: productId, tenantId: this.tenantId } });
    if (!product) {
        throw new NotFoundException('Product not found.');
    }

    // Check if already subscribed
    const existingAlert = await this.productAlertRepository.findOne({
        where: { userId, productId, alertType, tenantId: this.tenantId, isActive: true }
    });
    if (existingAlert) {
        throw new ConflictException(`User already subscribed to ${alertType} alerts for this product.`);
    }

    if (alertType === 'price_drop' && (thresholdPrice === undefined || thresholdPrice <= 0)) {
        throw new BadRequestException('Threshold price is required and must be positive for price drop alerts.');
    }

    const newAlert = this.productAlertRepository.create({
        userId,
        productId,
        alertType,
        thresholdPrice: alertType === 'price_drop' ? thresholdPrice : null,
        lastNotifiedPrice: product.salePrice || product.price, // Initialize with current price
        lastNotifiedStock: product.stock, // Initialize with current stock
        tenantId: this.tenantId,
        isActive: true,
    });
    return this.productAlertRepository.save(newAlert);
  }

  async unsubscribeFromAlert(userId: string, productId: string, alertType: 'price_drop' | 'back_in_stock'): Promise<void> {
    const result = await this.productAlertRepository.delete({
        userId, productId, alertType, tenantId: this.tenantId
    });
    if (result.affected === 0) {
        throw new NotFoundException('Product alert subscription not found.');
    }
  }

  async getUserProductAlerts(userId: string): Promise<ProductAlert[]> {
      return this.productAlertRepository.find({ where: { userId, tenantId: this.tenantId }, relations: ['product'] });
  }


  // --- Internal methods for checking and sending alerts ---
  private async checkAndSendPriceDropAlerts(product: Product, oldPrice: number) {
    const currentPrice = product.salePrice || product.price;
    if (currentPrice >= oldPrice) return; // No price drop

    const alerts = await this.productAlertRepository.find({
      where: {
        productId: product.id,
        alertType: 'price_drop',
        tenantId: this.tenantId,
        isActive: true,
      },
      relations: ['user'] // To get user details for notification
    });

    for (const alert of alerts) {
      if (alert.thresholdPrice && currentPrice <= alert.thresholdPrice && currentPrice < (alert.lastNotifiedPrice || Infinity)) {
        // Send price drop notification
        await this.notificationService.sendNotification(
            alert.userId,
            'price_drop_alert',
            'email', // Could also send push/in-app
            {
                productName: product.title,
                oldPrice: oldPrice.toFixed(2),
                newPrice: currentPrice.toFixed(2),
                productUrl: `/products/${product.slug}` // Placeholder URL
            }
        );
        // Update last notified price to prevent repeated notifications
        alert.lastNotifiedPrice = currentPrice;
        await this.productAlertRepository.save(alert);
      }
    }
  }

  private async checkAndSendBackInStockAlerts(product: Product) {
    if (product.stock <= 0) return; // Not back in stock

    const alerts = await this.productAlertRepository.find({
      where: {
        productId: product.id,
        alertType: 'back_in_stock',
        tenantId: this.tenantId,
        isActive: true,
      },
      relations: ['user']
    });

    for (const alert of alerts) {
      if (product.stock > (alert.lastNotifiedStock || 0)) {
        // Send back in stock notification
        await this.notificationService.sendNotification(
            alert.userId,
            'back_in_stock_alert',
            'email',
            {
                productName: product.title,
                stock: product.stock,
                productUrl: `/products/${product.slug}`
            }
        );
        // Deactivate alert or update last notified stock
        alert.isActive = false; // Deactivate after sending
        await this.productAlertRepository.save(alert);
      }
    }
  }
}