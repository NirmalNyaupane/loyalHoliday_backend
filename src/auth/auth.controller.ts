import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { cookieOptions } from 'src/utils/cookie.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  @ApiOperation({
    summary: 'use this end point to register user',
  })
  async registerUser(@Body() input: RegisterUserDto) {
    const response = await this.authService.registerUser(input);
    return {
      message: 'user created successfully',
      response,
    };
  }

  @Post('/user-login')
  async loginUser(@Body() loginUser: LoginUserDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(loginUser);
    res.cookie('access_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, cookieOptions);
    return res.status(HttpStatus.NO_CONTENT).json({});
  }
}
