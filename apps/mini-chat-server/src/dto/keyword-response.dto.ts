import 'reflect-metadata';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateKeywordResponseDto {
  @Expose()
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one keyword is required' })
  @IsString({ each: true })
  keywords!: string[];

  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Response text is required' })
  response!: string;

  @Expose()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  priority?: number;
}

export class UpdateKeywordResponseDto {
  @Expose()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  keywords?: string[];

  @Expose()
  @IsString()
  @IsOptional()
  response?: string;

  @Expose()
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  priority?: number;
}
