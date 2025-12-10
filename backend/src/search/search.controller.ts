import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchSuggestionsDto } from './dto/search.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    @ApiOperation({ summary: 'Search products and categories' })
    @ApiResponse({ status: 200, description: 'Returns search results with filters' })
    search(@Query() searchDto: SearchQueryDto) {
        return this.searchService.search(searchDto);
    }

    @Get('suggestions')
    @ApiOperation({ summary: 'Get search suggestions' })
    @ApiResponse({ status: 200, description: 'Returns search suggestions' })
    getSuggestions(@Query() suggestDto: SearchSuggestionsDto) {
        return this.searchService.getSuggestions(suggestDto);
    }

    @Get('popular')
    @ApiOperation({ summary: 'Get popular searches' })
    @ApiResponse({ status: 200, description: 'Returns popular search terms' })
    getPopularSearches(@Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.searchService.getPopularSearches(limitNum);
    }

    @Get('trending')
    @ApiOperation({ summary: 'Get trending products' })
    @ApiResponse({ status: 200, description: 'Returns trending products' })
    getTrendingProducts(@Query('limit') limit?: string) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.searchService.getTrendingProducts(limitNum);
    }
}
