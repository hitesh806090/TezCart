import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductQaService } from './product-qa.service';
import { ProductQaController } from './product-qa.controller';
import { ProductQuestion } from '../entities/product-question.entity';
import { ProductAnswer } from '../entities/product-answer.entity';
import { Product } from '../entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProductQuestion, ProductAnswer, Product])],
    controllers: [ProductQaController],
    providers: [ProductQaService],
    exports: [ProductQaService],
})
export class ProductQaModule { }
