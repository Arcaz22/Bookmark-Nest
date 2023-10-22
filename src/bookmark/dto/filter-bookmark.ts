import { IsOptional, IsString } from 'class-validator';

export class FilterBookmark {
  @IsOptional()
  @IsString()
  search?: string;
}
