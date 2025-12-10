import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    private generateSlug;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(includeInactive?: boolean): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    findRootCategories(): Promise<Category[]>;
    findChildren(parentId: string): Promise<Category[]>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
    private checkCircularReference;
}
