export declare enum SearchType {
    PRODUCTS = "products",
    CATEGORIES = "categories",
    ALL = "all"
}
export declare enum SortOption {
    RELEVANCE = "relevance",
    PRICE_LOW = "price_low",
    PRICE_HIGH = "price_high",
    NEWEST = "newest",
    RATING = "rating",
    POPULAR = "popular"
}
export declare class SearchQueryDto {
    q?: string;
    type?: SearchType;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    minRating?: number;
    inStock?: boolean;
    sortBy?: SortOption;
    page?: number;
    limit?: number;
}
export declare class SearchSuggestionsDto {
    q?: string;
    limit?: number;
}
