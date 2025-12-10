import { SearchService } from './search.service';
import { SearchQueryDto, SearchSuggestionsDto } from './dto/search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(searchDto: SearchQueryDto): Promise<any>;
    getSuggestions(suggestDto: SearchSuggestionsDto): Promise<any>;
    getPopularSearches(limit?: string): Promise<any>;
    getTrendingProducts(limit?: string): Promise<import("../entities/product.entity").Product[]>;
}
