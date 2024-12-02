import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser, GetActiveUser } from 'src/decorators/get-active-user';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('user')
export class UserController {
  @Get('me')
  async me(@GetActiveUser() user:ActiveUser) {
    return { message: 'hello' };
  }
}
