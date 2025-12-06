import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomePageContent } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { ProductService } from '..//product/product.service';
import { CategoryService } from '..//category/category.service';
import { SearchService } from '..//search/search.service';

@Injectable()
export class HomePageService {
  private readonly logger = new Logger(HomePageService.name);

  constructor(
    @InjectRepository(HomePageContent)
    private readonly homepageContentRepository: Repository<HomePageContent>,
    private readonly tenantProvider: TenantProvider,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly searchService: SearchService, // To search for products
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async getHomepageContent(): Promise<any[]> {
    const now = new Date();
    const activeSections = await this.homepageContentRepository.find({
      where: {
        tenantId: this.tenantId,
        isActive: true,
        // startDate: LessThanOrEqual(now), // For production, add date range filtering
        // endDate: MoreThanOrEqual(now),
      },
      order: { sectionOrder: 'ASC' },
    });

    const renderedContent = [];
    for (const section of activeSections) {
      let resolvedData: any = {};
      try {
        switch (section.sectionType) {
          case 'banner':
          case 'carousel':
            resolvedData = section.content; // Static content directly from DB
            break;
          case 'categoryGrid':
            // Example: Fetch categories by IDs or a query
            if (section.content && (section.content as any).categoryIds) {
              const categoryIds = (section.content as any).categoryIds;
              const categories = await Promise.all(
                categoryIds.map(id => this.categoryService.findCategoryById(id).catch(() => null))
              );
              resolvedData = { categories: categories.filter(Boolean) };
            } else {
              // Fetch some default categories, e.g., root categories
              const allCategories = await this.categoryService.findAllCategories();
              resolvedData = { categories: allCategories.filter(cat => !cat.parentId) }; // Root categories
            }
            break;
          case 'productGrid':
            // Example: Fetch products based on query, sort, limit
            const productContent = section.content as any;
            const searchOptions = {
                filter: [`status = "published"`], // Always published for storefront
                sort: productContent.sort ? productContent.sort.split(',').map(s => s.trim()) : ['createdAt:desc'],
                limit: productContent.limit || 10,
            };
            const searchResult = await this.searchService.searchProducts(productContent.query || '', searchOptions);
            resolvedData = { products: searchResult.hits };
            break;
          default:
            this.logger.warn(`Unknown section type: ${section.sectionType}`);
            resolvedData = {};
        }
      } catch (error) {
        this.logger.error(`Error resolving data for section ${section.id}: ${error.message}`);
        resolvedData = { error: 'Failed to load section data' };
      }
      renderedContent.push({
        id: section.id,
        sectionType: section.sectionType,
        title: section.title,
        data: resolvedData,
      });
    }
    return renderedContent;
  }

  // Admin CRUD for homepage content sections
  async createSection(sectionData: Partial<HomePageContent>): Promise<HomePageContent> {
    const newSection = this.homepageContentRepository.create({
      ...sectionData,
      tenantId: this.tenantId,
    });
    return this.homepageContentRepository.save(newSection);
  }

  async updateSection(id: string, updateData: Partial<HomePageContent>): Promise<HomePageContent> {
    const section = await this.homepageContentRepository.findOne({
      where: { id, tenantId: this.tenantId },
    });
    if (!section) {
      throw new NotFoundException(`Homepage section with ID ${id} not found.`);
    }
    this.homepageContentRepository.merge(section, updateData);
    return this.homepageContentRepository.save(section);
  }

  async deleteSection(id: string): Promise<void> {
    const result = await this.homepageContentRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Homepage section with ID ${id} not found.`);
    }
  }
}