import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    // Generate slug from name
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const slug = this.generateSlug(createCategoryDto.name);

        // Check if category with same name or slug exists
        const existing = await this.categoriesRepository.findOne({
            where: [{ name: createCategoryDto.name }, { slug }],
        });

        if (existing) {
            throw new ConflictException('Category with this name already exists');
        }

        // Verify parent exists if parentId is provided
        if (createCategoryDto.parentId) {
            const parent = await this.categoriesRepository.findOne({
                where: { id: createCategoryDto.parentId },
            });
            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }
        }

        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            slug,
        });

        return this.categoriesRepository.save(category);
    }

    async findAll(includeInactive = false): Promise<Category[]> {
        const query = this.categoriesRepository
            .createQueryBuilder('category')
            .leftJoinAndSelect('category.parent', 'parent')
            .leftJoinAndSelect('category.children', 'children')
            .orderBy('category.displayOrder', 'ASC')
            .addOrderBy('category.name', 'ASC');

        if (!includeInactive) {
            query.where('category.isActive = :isActive', { isActive: true });
        }

        return query.getMany();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return category;
    }

    async findBySlug(slug: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { slug },
            relations: ['parent', 'children'],
        });

        if (!category) {
            throw new NotFoundException(`Category with slug ${slug} not found`);
        }

        return category;
    }

    async findRootCategories(): Promise<Category[]> {
        return this.categoriesRepository.find({
            where: { parentId: IsNull(), isActive: true },
            relations: ['children'],
            order: { displayOrder: 'ASC', name: 'ASC' },
        });
    }

    async findChildren(parentId: string): Promise<Category[]> {
        const parent = await this.findOne(parentId);

        return this.categoriesRepository.find({
            where: { parentId: parent.id, isActive: true },
            order: { displayOrder: 'ASC', name: 'ASC' },
        });
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        // Check for name conflicts if name is being updated
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const slug = this.generateSlug(updateCategoryDto.name);
            const existing = await this.categoriesRepository.findOne({
                where: [{ name: updateCategoryDto.name }, { slug }],
            });

            if (existing && existing.id !== id) {
                throw new ConflictException('Category with this name already exists');
            }

            category.slug = slug;
        }

        // Verify new parent exists if parentId is being updated
        if (updateCategoryDto.parentId) {
            if (updateCategoryDto.parentId === id) {
                throw new BadRequestException('Category cannot be its own parent');
            }

            const parent = await this.categoriesRepository.findOne({
                where: { id: updateCategoryDto.parentId },
            });
            if (!parent) {
                throw new NotFoundException('Parent category not found');
            }

            // Check for circular reference
            const isCircular = await this.checkCircularReference(id, updateCategoryDto.parentId);
            if (isCircular) {
                throw new BadRequestException('Cannot create circular category reference');
            }
        }

        Object.assign(category, updateCategoryDto);

        return this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);

        // Check if category has children
        const childrenCount = await this.categoriesRepository.count({
            where: { parentId: id },
        });

        if (childrenCount > 0) {
            throw new BadRequestException('Cannot delete category with subcategories. Delete subcategories first.');
        }

        await this.categoriesRepository.remove(category);
    }

    // Helper method to check for circular references
    private async checkCircularReference(categoryId: string, newParentId: string): Promise<boolean> {
        let currentId: string | null | undefined = newParentId;
        const visited = new Set<string>();

        while (currentId) {
            if (visited.has(currentId) || currentId === categoryId) {
                return true;
            }
            visited.add(currentId);

            const category = await this.categoriesRepository.findOne({
                where: { id: currentId },
            });

            currentId = category?.parentId || null;
        }

        return false;
    }
}
