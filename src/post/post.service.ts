import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostModel } from './post.schema';

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

  async getAllPostsOfUsers(userId:string){

  }
}
