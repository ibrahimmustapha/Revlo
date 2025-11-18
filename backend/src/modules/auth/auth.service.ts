import { prisma } from '../../config/prisma';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { AuthLoginInput, AuthRegisterInput, AuthResponse } from './auth.types';

const ensureIdentifier = (data: AuthRegisterInput | AuthLoginInput) => {
  if (!data.email && !data.phone) {
    throw new Error('Email or phone is required');
  }
};

export const register = async (data: AuthRegisterInput): Promise<AuthResponse> => {
  ensureIdentifier(data);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        data.email ? { email: data.email } : undefined,
        data.phone ? { phone: data.phone } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (existingUser) {
    throw new Error('User with provided email/phone already exists');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      passwordHash,
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
};

export const login = async (data: AuthLoginInput): Promise<AuthResponse> => {
  ensureIdentifier(data);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        data.email ? { email: data.email } : undefined,
        data.phone ? { phone: data.phone } : undefined,
      ].filter(Boolean) as any,
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
};
