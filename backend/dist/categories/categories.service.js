"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    constructor(categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async create(createCategoryDto) {
        const slug = this.generateSlug(createCategoryDto.name);
        const existing = await this.categoriesRepository.findOne({
            where: [{ name: createCategoryDto.name }, { slug }],
        });
        if (existing) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        if (createCategoryDto.parentId) {
            const parent = await this.categoriesRepository.findOne({
                where: { id: createCategoryDto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        const category = this.categoriesRepository.create({
            ...createCategoryDto,
            slug,
        });
        return this.categoriesRepository.save(category);
    }
    async findAll(includeInactive = false) {
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
    async findOne(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.categoriesRepository.findOne({
            where: { slug },
            relations: ['parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug ${slug} not found`);
        }
        return category;
    }
    async findRootCategories() {
        return this.categoriesRepository.find({
            where: { parentId: (0, typeorm_2.IsNull)(), isActive: true },
            relations: ['children'],
            order: { displayOrder: 'ASC', name: 'ASC' },
        });
    }
    async findChildren(parentId) {
        const parent = await this.findOne(parentId);
        return this.categoriesRepository.find({
            where: { parentId: parent.id, isActive: true },
            order: { displayOrder: 'ASC', name: 'ASC' },
        });
    }
    async update(id, updateCategoryDto) {
        const category = await this.findOne(id);
        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const slug = this.generateSlug(updateCategoryDto.name);
            const existing = await this.categoriesRepository.findOne({
                where: [{ name: updateCategoryDto.name }, { slug }],
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('Category with this name already exists');
            }
            category.slug = slug;
        }
        if (updateCategoryDto.parentId) {
            if (updateCategoryDto.parentId === id) {
                throw new common_1.BadRequestException('Category cannot be its own parent');
            }
            const parent = await this.categoriesRepository.findOne({
                where: { id: updateCategoryDto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent category not found');
            }
            const isCircular = await this.checkCircularReference(id, updateCategoryDto.parentId);
            if (isCircular) {
                throw new common_1.BadRequestException('Cannot create circular category reference');
            }
        }
        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        const childrenCount = await this.categoriesRepository.count({
            where: { parentId: id },
        });
        if (childrenCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category with subcategories. Delete subcategories first.');
        }
        await this.categoriesRepository.remove(category);
    }
    async checkCircularReference(categoryId, newParentId) {
        let currentId = newParentId;
        const visited = new Set();
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
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map