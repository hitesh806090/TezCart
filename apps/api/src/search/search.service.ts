import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, Index } from 'meilisearch';
import { Product } from 'db';
import { TenantProvider } from '..//common/tenant.module';

// Define a common interface for search document structure
interface ProductSearchDocument {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
  categoryId?: string;
  sellerId?: string;
  status: string;
  // Add other relevant fields for search
}

@Injectable()
export class SearchService implements OnModuleInit, OnModuleDestroy {
  private readonly client: MeiliSearch;
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly tenantProvider: TenantProvider,
  ) {
    const host = this.configService.get<string>('MEILISEARCH_HOST');
    const apiKey = this.configService.get<string>('MEILISEARCH_API_KEY');

    if (!host) {
      this.logger.error('MEILISEARCH_HOST is not defined in environment variables.');
      throw new Error('MeiliSearch host is not configured.');
    }

    this.client = new MeiliSearch({ host, apiKey });
  }

  async onModuleInit() {
    this.logger.log('Initializing MeiliSearch client...');
    try {
      await this.client.getVersion();
      this.logger.log('MeiliSearch connection successful.');
      await this.configureProductIndex();
    } catch (error) {
      this.logger.error('Failed to connect to MeiliSearch or configure index:', error);
      // Depending on criticality, you might want to throw the error
    }
  }

  onModuleDestroy() {
    this.logger.log('MeiliSearch client destroyed.');
  }

  private getProductIndex(): Index<ProductSearchDocument> {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      // In a real scenario, requests without tenantId shouldn't reach here for tenant-scoped operations
      // For system-wide searches, this would be a global index.
      this.logger.warn('No tenantId in context, using a generic product index name.');
      return this.client.index<ProductSearchDocument>('products');
    }
    // Use tenant-specific index for product search
    return this.client.index<ProductSearchDocument>(`products_${tenantId}`);
  }

  private async configureProductIndex() {
    // This method should be called once per tenant on index creation
    // For now, it configures the index for the current tenant in context
    // This is more complex for multi-tenancy where indices might be created dynamically
    // or managed by a super-admin.
    const index = this.getProductIndex();

    await index.updateSettings({
      searchableAttributes: ['title', 'description', 'slug', 'category', 'seller'],
      filterableAttributes: ['tenantId', 'categoryId', 'sellerId', 'price', 'salePrice', 'status'],
      sortableAttributes: ['price', 'createdAt', 'updatedAt'],
    });
    this.logger.log(`MeiliSearch index configured for ${index.uid}`);
  }

  async addOrUpdateProduct(product: Product): Promise<void> {
    const index = this.getProductIndex();
    const document: ProductSearchDocument = {
      id: product.id,
      tenantId: product.tenantId,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: Number(product.price), // MeiliSearch prefers number for filtering/sorting
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      status: product.status,
    };
    await index.addDocuments([document]);
    this.logger.debug(`Indexed product ${product.id} into ${index.uid}`);
  }

  async deleteProduct(productId: string): Promise<void> {
    const index = this.getProductIndex();
    await index.deleteDocument(productId);
    this.logger.debug(`Deleted product ${productId} from ${index.uid}`);
  }

  async searchProducts(query: string, options?: any): Promise<any> {
    const index = this.getProductIndex();
    const searchOptions: any = {
      filter: [`tenantId = "${this.tenantProvider.tenantId}"`], // Ensure tenant scoping
      ...options,
    };
    const result = await index.search(query, searchOptions);
    return result;
  }
}