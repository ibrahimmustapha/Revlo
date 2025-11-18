import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export type PrismaTx = Parameters<Parameters<typeof prisma.$transaction>[0]> extends [infer T]
  ? T
  : never;
