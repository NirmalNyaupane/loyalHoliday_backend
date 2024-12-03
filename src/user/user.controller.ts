import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser, GetActiveUser } from 'src/decorators/get-active-user';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  async me(@GetActiveUser() user: ActiveUser) {
    return this.userService.findUserById(user.id);
  }
}
