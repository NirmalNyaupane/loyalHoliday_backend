import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {}
  @Post('/register')
  @ApiOperation({
    summary: 'use this end point to register user',
  })
  async registerUser(@Body() input:RegisterUserDto) {
    const response = await this.authService.registerUser(input);
    return {
      message:"user created successfully", 
      response
    }
  }
}
