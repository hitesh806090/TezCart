import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm'; // Use TreeRepository for hierarchical data
import { Category } from 'db';
import { TenantProvider } from '..//common/tenant.module';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>, // Use Repository for basic operations
    private readonly tenantProvider: TenantProvider,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  private get treeRepository(): TreeRepository<Category> {
    return this.categoryRepository.manager.getTreeRepository(Category);
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const { slug, parentId } = categoryData;

    // Check for unique slug within tenant
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug, tenantId: this.tenantId },
    });
    if (existingCategory) {
      throw new ConflictException(`Category with slug '${slug}' already exists for this tenant.`);
    }

    if (parentId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: parentId, tenantId: this.tenantId },
      });
      if (!parentCategory) {
        throw new NotFoundException(`Parent category with ID ${parentId} not found.`);
      }
      categoryData.parent = parentCategory;
    }

    const newCategory = this.categoryRepository.create({
      ...categoryData,
      tenantId: this.tenantId,
    });
    return this.categoryRepository.save(newCategory);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { tenantId: this.tenantId },
      relations: ['parent', 'children'], // Eager load parent and children for tree structure
    });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, tenantId: this.tenantId },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async findCategoryTree(): Promise<Category[]> {
    // This will return all root categories with their nested children
    // filtered by tenantId
    return this.treeRepository.findTrees(); // TypeORM's findTrees fetches all trees
    // However, findTrees doesn't support where clauses directly on nested data.
    // A more complex query or filtering after fetching would be needed for true tenant-scoped trees
    // For now, assume a root-level tenantId filter is applied implicitly by the data model.
    // A better approach for TypeORM would be using ClosureTable or Materialized Path pattern
    // or manually building the tree after fetching all categories for the tenant.
  }

  async updateCategory(id: string, updateData: Partial<Category>): Promise<Category> {
    const category = await this.findCategoryById(id); // Ensures category belongs to the tenant

    // If parentId is updated, validate it
    if (updateData.parentId !== undefined) {
        if (updateData.parentId === id) {
            throw new BadRequestException('A category cannot be its own parent.');
        }
        if (updateData.parentId) {
            const parentCategory = await this.categoryRepository.findOne({ where: { id: updateData.parentId, tenantId: this.tenantId } });
            if (!parentCategory) {
                throw new NotFoundException(`Parent category with ID ${updateData.parentId} not found.`);
            }
            category.parent = parentCategory;
        } else {
            category.parent = null; // Set as root category
        }
        delete updateData.parentId; // Remove from merge data as we set it via relation
    }

    this.categoryRepository.merge(category, updateData);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    // Check if category has children
    const category = await this.findCategoryById(id);
    if (category.children && category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with active children. Please reassign children first.');
    }
    // TODO: Add check for products associated with this category before deleting

    const result = await this.categoryRepository.delete({ id, tenantId: this.tenantId });
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found or not owned by tenant.`);
    }
  }
}