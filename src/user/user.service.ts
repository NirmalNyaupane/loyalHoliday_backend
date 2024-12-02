import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findUserByEmail(
    email: string,
    throwable?: { throwErrorOnFound?: boolean; throwErrorOnNotFound?: boolean },
  ) {
    const user = await this.userModel.findOne({
      email,
    });

    if (throwable?.throwErrorOnFound) {
      if (user) {
        throw new BadRequestException({
          messge: 'User with same email is already exists',
        });
      }
    }

    if (throwable?.throwErrorOnNotFound) {
      if (!user) {
        throw new BadRequestException({
          message: 'User is not found',
        });
      }
    }
    return user;
  }

  async findUserById(
    id: string,
    throwable?: { throwErrorOnNotFound?: boolean },
  ) {
    const user = await this.userModel.findOne({
      _id: id,
    });

    if (throwable?.throwErrorOnNotFound) {
      if (!user) {
        throw new BadRequestException({
          message: 'User is not found',
        });
      }
    }
    return user;
  }

  async findUserByPhone(
    phone: string,
    throwable?: { throwErrorOnFound?: boolean; throwErrorOnNotFound?: boolean },
  ) {
    const user = await this.userModel.findOne({
      phone,
    });

    if (throwable?.throwErrorOnFound) {
      if (user) {
        throw new BadRequestException({
          messge: 'User with same phone number is already exists',
        });
      }
    }

    if (throwable.throwErrorOnNotFound) {
      if (!user) {
        throw new BadRequestException({
          message: 'User is not found',
        });
      }
    }
    return user;
  }
}
