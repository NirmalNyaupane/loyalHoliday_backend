import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { hash, verifyHash } from 'src/utils/hash.util';
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

  async changePassword(input: ChangePasswordDto) {
    const user = await this.findUserById(input.userId);
    
    //check old password is correct or not
    const isOldPasswordCorrect = await verifyHash(
      user.password,
      input.oldPassword,
    );
    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Password is incorrect');
    }
    if (input.oldPassword === input.newPassword) {
      throw new BadRequestException(
        'Old password and new password must be difference',
      );
    }
    //hash new password
    const hashPassword = await hash(input.newPassword);
    return this.userModel.updateOne(
      {
        _id: input.userId,
      },
      {
        password: hashPassword,
      },
    );
  }
}
