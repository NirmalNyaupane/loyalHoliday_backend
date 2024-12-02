import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/constants/emum';
export interface ActiveUser {
  id: string;
  role: Role;
}

export const GetActiveUser = createParamDecorator(
  (_data: string, ctx: ExecutionContext):ActiveUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return { id: user.sub, role: user.role };
  },
);
