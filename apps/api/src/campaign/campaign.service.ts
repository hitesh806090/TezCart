import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from 'db';
import { CampaignProduct } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { ProductService } from '../product/product.service'; // To validate products

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignProduct)
    private readonly campaignProductRepository: Repository<CampaignProduct>,
    private readonly tenantProvider: TenantProvider,
    private readonly productService: ProductService,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    if (campaignData.validFrom && campaignData.validUntil && campaignData.validFrom >= campaignData.validUntil) {
      throw new BadRequestException('ValidFrom date must be before ValidUntil date.');
    }
    const existingCampaign = await this.campaignRepository.findOne({ where: { slug: campaignData.slug, tenantId: this.tenantId } });
    if (existingCampaign) {
      throw new ConflictException(`Campaign with slug '${campaignData.slug}' already exists.`);
    }

    const newCampaign = this.campaignRepository.create({
      ...campaignData,
      tenantId: this.tenantId,
      status: 'draft', // Initial status
    });
    return this.campaignRepository.save(newCampaign);
  }

  async findAllCampaigns(): Promise<Campaign[]> {
    return this.campaignRepository.find({ where: { tenantId: this.tenantId }, order: { validFrom: 'DESC' } });
  }

  async findCampaignById(id: string): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id, tenantId: this.tenantId } });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found.`);
    }
    return campaign;
  }

  async updateCampaign(id: string, updateData: Partial<Campaign>): Promise<Campaign> {
    const campaign = await this.findCampaignById(id);
    if (updateData.validFrom && updateData.validUntil && updateData.validFrom >= updateData.validUntil) {
      throw new BadRequestException('ValidFrom date must be before ValidUntil date.');
    }
    this.campaignRepository.merge(campaign, updateData);
    return this.campaignRepository.save(campaign);
  }

  async deleteCampaign(id: string): Promise<void> {
    const result = await this.campaignRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign with ID ${id} not found.`);
    }
  }

  async addProductToCampaign(campaignId: string, productId: string, campaignProductData: Partial<CampaignProduct>): Promise<CampaignProduct> {
    const campaign = await this.findCampaignById(campaignId);
    const product = await this.productService.findProductById(productId); // Ensures product exists in tenant

    const existingCampaignProduct = await this.campaignProductRepository.findOne({ where: { campaignId, productId, tenantId: this.tenantId } });
    if (existingCampaignProduct) {
      throw new ConflictException(`Product ${productId} is already part of campaign ${campaignId}.`);
    }

    const campaignProduct = this.campaignProductRepository.create({
      ...campaignProductData,
      campaignId: campaign.id,
      productId: product.id,
      tenantId: this.tenantId,
    });
    return this.campaignProductRepository.save(campaignProduct);
  }

  async getCampaignProducts(campaignId: string): Promise<CampaignProduct[]> {
    return this.campaignProductRepository.find({ where: { campaignId, tenantId: this.tenantId }, relations: ['product'] });
  }

  async removeProductFromCampaign(campaignProductId: string): Promise<void> {
    const result = await this.campaignProductRepository.delete({ id: campaignProductId, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Campaign product with ID ${campaignProductId} not found.`);
    }
  }

  // TODO: Method to get active campaigns for a product or category for pricing engine integration
  // TODO: Logic for updating product prices/stock in main product table when campaign becomes active/inactive
}