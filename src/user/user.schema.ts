import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../constants/emum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ unique: true })
  phone: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Role })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
