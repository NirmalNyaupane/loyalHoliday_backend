import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActiveUser, GetActiveUser } from 'src/decorators/get-active-user';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtGuard, RoleGuard)
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @ApiOperation({ summary: 'Get profile of current active user' })
  async me(@GetActiveUser() user: ActiveUser) {
    return this.userService.findUserById(user.id);
  }

  @Patch('/change-password')
  @ApiOperation({ summary: 'Change the password of a current user' })
  async changePassword(
    @Body() data: ChangePasswordDto,
    @GetActiveUser() user: ActiveUser,
  ) {
    data.userId = user.id;
    await this.userService.changePassword(data);
    return {
      message: 'Password changed sucessfully',
    };
  }
}
