import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('user')
export class UserController {
  @Get('me')
  @UseGuards(JwtGuard)
  async me() {
    return { message: 'hello' };
  }
}
