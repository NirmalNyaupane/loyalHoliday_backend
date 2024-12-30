import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(50, 3000)
  content: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsNotEmpty()
  isPublished: boolean;

  authId: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {} 