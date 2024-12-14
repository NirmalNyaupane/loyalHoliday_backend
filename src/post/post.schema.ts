import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

export type PostDocument = mongoose.HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ required: true, type: String, default: false })
  isPublished: boolean; //if it is false, it means post is saved on draft

  @Prop({ required: true, type: Boolean, default: false })
  isVerified: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  auther: User[]; //auther of the post
}

export const PostSchema = SchemaFactory.createForClass(Post);
