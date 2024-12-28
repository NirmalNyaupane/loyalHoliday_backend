import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from './post.schema';
import { FilterDateType } from 'src/constants/emum';
import { findDateRangeForFilter } from 'src/utils/date.util';
import { GetUserPostDto, PostTypes } from './dto/get-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel.name) private postModel: Model<PostModel>,
  ) {}
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
        filter.isVerified = false;
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
    return await this.postModel.find(finalFilter);
  }
}
