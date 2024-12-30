import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf
} from 'class-validator';
import { FilterDateType } from 'src/constants/emum';

export class PaginatedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}

export class SearchDto extends PaginatedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class PaginatedDateFilterDto extends SearchDto {
  @ApiPropertyOptional({
    enum: FilterDateType,
  })
  @IsOptional()
  @IsEnum(FilterDateType)
  date?: FilterDateType;

  @ApiPropertyOptional()
  @ValidateIf((obj) => obj?.endDate)
  @IsISO8601()
  startDate: string;

  @ApiPropertyOptional()
  @ValidateIf((obj) => obj?.startDate)
  @IsISO8601()
  endDate: string;
}
