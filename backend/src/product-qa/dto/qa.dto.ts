import {
    IsString,
    MinLength,
    MaxLength,
    IsOptional,
    IsInt,
    Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
    @ApiProperty({ example: 'What is the warranty period for this product?' })
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    question: string;
}

export class CreateAnswerDto {
    @ApiProperty({ example: 'This product comes with a 1-year manufacturer warranty.' })
    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    answer: string;
}

export class QuestionQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    answeredOnly?: boolean;
}
