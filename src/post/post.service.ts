import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, RootFilterQuery } from 'mongoose';
import { FilterDateType } from 'src/constants/emum';
import { ActiveUser } from 'src/decorators/get-active-user';
import { findDateRangeForFilter } from 'src/utils/date.util';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';
import { GetUserPostDto, PostTypes } from './dto/get-post.dto';
import { Post as PostModel } from './post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel.name) private postModel: PaginateModel<PostModel>,
  ) {}

  async findOneById(id: string) {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new BadRequestException('Post is not found');
    }
    return post;
  }

  async createPost(data: CreatePostDto) {
    return await this.postModel.create({
      auther: data.authId,
      title: data.title,
      content: data.content,
      isPublished: data.isPublished,
    });
  }

  getDateFilter(dateType?: FilterDateType) {
    const filter: RootFilterQuery<PostModel> = {};
    if (!dateType) {
      return filter;
    }
    if (dateType === FilterDateType.CUSTOM) {
      return filter;
    }
    const { startDate, endDate } = findDateRangeForFilter(dateType);
    filter.createdAt = { $gte: startDate, $lte: endDate };
    return filter;
  }

  getPostTypeFilter(postTypes?: PostTypes) {
    const filter: RootFilterQuery<PostModel> = {};
    if (!postTypes) {
      return filter;
    }
    switch (postTypes) {
      case PostTypes.ALL:
        return filter;
      case PostTypes.DRAFT:
        filter.isPublished = false;
        break;
      case PostTypes.POST:
        filter.isPublished = true;
        break;
      case PostTypes.PUBLISHED:
        filter.isPublished = true;
        filter.isVerified = true;
        break;
    }
    return filter;
  }

  async getAllPostsOfUsers(userId: string, query: GetUserPostDto) {
    const baseFilter: RootFilterQuery<PostModel> = { auther: userId };
    const dateFilter = this.getDateFilter(query.date);
    const postTypeFilter = this.getPostTypeFilter(query.postType);
    if (query.search) {
      baseFilter.title = { $regex: query.search, $options: 'i' };
    }
    const finalFilter = {
      ...baseFilter,
      ...dateFilter,
      ...postTypeFilter,
    };
    return await this.postModel.paginate(finalFilter, {
      page: query.page,
      limit: query.limit,
    });
  }

  async updatePost(data: UpdatePostDto, user: ActiveUser, postId: string) {
    const post = await this.findOneById(postId);
    if (post.auther._id.toString() !== user.id) {
      throw new BadRequestException('You are not allowed to update this post');
    }
    return await this.postModel.findOneAndUpdate(
      {
        _id: postId,
      },
      data,
      { new: true },
    );
  }
}
