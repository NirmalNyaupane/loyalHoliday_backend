import {Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { hash } from 'src/utils/hash.util';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async registerUser(data: RegisterUserDto) {
    await Promise.all([
      this.userService.findUserByEmail(data.email, {
        throwErrorOnFound: true,
      }),

      this.userService.findUserByPhone(data.phone, {
        throwErrorOnFound: true,
      }),
    ]);
    const hashedPassword = await hash(data.password);
    return this.userModel.create({
      ...data,
      password: hashedPassword,
    });
  }
}
