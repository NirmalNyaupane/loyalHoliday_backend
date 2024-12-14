import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedDateFilterDto } from 'src/common/common.dto';

export enum PostTypes {
  POST = 'POST',
  DRAFT = 'DRAFT',
  PUBLISHED = 'VERIFIED',
  ALL = 'ALL',
}

export class GetUserPostDto extends PaginatedDateFilterDto {
  @ApiPropertyOptional({
    enum: PostTypes,
  })
  @IsOptional()
  @IsEnum(PostTypes)
  postType?: PostTypes;
}
