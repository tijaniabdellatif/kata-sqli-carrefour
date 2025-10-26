import 'reflect-metadata';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class SendMessageDto {
  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Message content is required' })
  @MinLength(1, { message: 'Message must be at least 1 character' })
  @MaxLength(1000, { message: 'Message must not exceed 1000 characters' })
  content!: string;

  @Expose()
  @IsString()
  @IsOptional()
  conversationId?: string;
}
