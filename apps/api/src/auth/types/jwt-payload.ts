import { Role } from '@prisma/client';

export type JwtPayloadUser = {
  sub: string;
  email: string;
  role: Role;
};
