import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActiveUser, GetActiveUser } from 'src/decorators/get-active-user';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { GetUserPostDto } from './dto/get-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('post')
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  @ApiOperation({
    summary: 'Create a new post',
  })
  async createPost(
    @Body() data: CreatePostDto,
    @GetActiveUser() user: ActiveUser,
  ) {
    data.authId = user.id;
    return this.postService.createPost(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post by user',
  })
  async updatePost(
    @Body() data: UpdatePostDto,
    @GetActiveUser() user: ActiveUser,
    @Param('id') postId: string,
  ) {
    return this.postService.updatePost(data, user, postId);
  }

  @Get('/my-posts')
  @ApiOperation({
    summary: 'Get all posts created by current user',
  })
  async getMyPost(
    @Query() query: GetUserPostDto,
    @GetActiveUser() user: ActiveUser,
  ) {
    return this.postService.getAllPostsOfUsers(user.id, query);
  }
}
