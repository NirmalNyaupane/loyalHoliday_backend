import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/constants/emum';
export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);