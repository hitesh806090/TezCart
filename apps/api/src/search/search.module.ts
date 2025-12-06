import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [ConfigModule], // Import ConfigModule
  providers: [SearchService],
  exports: [SearchService], // Export SearchService for integration with ProductService
})
export class SearchModule {}