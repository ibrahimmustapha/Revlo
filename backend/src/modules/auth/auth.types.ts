import { User, UserRole } from '@prisma/client';

export type AuthTokenPayload = {
  userId: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthRegisterInput = {
  email?: string;
  phone?: string;
  password: string;
};

export type AuthLoginInput = {
  email?: string;
  phone?: string;
  password: string;
};
