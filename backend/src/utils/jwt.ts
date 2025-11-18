import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '@prisma/client';

export type JwtPayload = {
  userId: string;
  role: UserRole;
};

export const signToken = (payload: JwtPayload, expiresIn: SignOptions['expiresIn'] = '7d'): string => {
  return jwt.sign(payload, env.jwtSecret as Secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret as Secret) as JwtPayload;
};
