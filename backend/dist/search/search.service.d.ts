import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { SearchQueryDto, SearchSuggestionsDto } from './dto/search.dto';
export declare class SearchService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    search(searchDto: SearchQueryDto): Promise<any>;
    getSuggestions(suggestDto: SearchSuggestionsDto): Promise<any>;
    getPopularSearches(limit?: number): Promise<any>;
    getTrendingProducts(limit?: number): Promise<Product[]>;
    private getSearchFilters;
}
