import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { hash, verifyHash } from 'src/utils/hash.util';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/constants/emum';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configServie: ConfigService,
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
      role: Role.USER,
      password: hashedPassword,
    });
  }

  async validateUserRoleDuringLogin(email: string, role: Role) {
    const user = await this.userService.findUserByEmail(email, {
      throwErrorOnNotFound: true,
    });
    if (user.role !== role) {
      throw new BadRequestException(
        'You are not allowed to login using this route',
      );
    }
    return user;
  }

  async generateAccessTokenAndRefreshToken(id: string, role: Role) {
    //access token
    const accessToken = this.jwtService.sign(
      {
        sub: id,
        role,
      },
      {
        secret: this.configServie.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configServie.get('JWT_ACCESS_TOKEN_EXPIRE'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: id,
        role,
      },
      {
        secret: this.configServie.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configServie.get('JWT_REFRESH_TOKEN_EXPIRE'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginUser(input: LoginUserDto) {
    const user = await this.validateUserRoleDuringLogin(input.email, Role.USER);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    //validate password
    const isPasswordCorrect = await verifyHash(user.password, input.password);
    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.generateAccessTokenAndRefreshToken(user.id, user.role);
  }
}
