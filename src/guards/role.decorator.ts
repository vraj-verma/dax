import { SetMetadata } from '@nestjs/common';

export const Role = (...roles: any[]) => SetMetadata('roles', roles);
