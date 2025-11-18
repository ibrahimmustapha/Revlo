import { prisma } from '../../config/prisma';

export const getMe = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      kyc: true,
      paymentMethods: true,
    },
  });
};

export const upsertProfile = async (
  userId: string,
  data: { fullName?: string; country?: string; preferredCurrency?: string; avatarUrl?: string },
) => {
  await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
};
