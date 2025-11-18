import { KycStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const upsertKyc = async (
  userId: string,
  data: {
    documentType: string;
    documentNumber: string;
    documentFrontPath: string;
    documentBackPath: string;
    selfiePath?: string;
    status?: KycStatus;
  },
) => {
  await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return prisma.kyc.upsert({
    where: { userId },
    create: {
      userId,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentFrontUrl: data.documentFrontPath,
      documentBackUrl: data.documentBackPath,
      selfieUrl: data.selfiePath,
      status: KycStatus.PENDING,
    },
    update: {
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      documentFrontUrl: data.documentFrontPath,
      documentBackUrl: data.documentBackPath,
      selfieUrl: data.selfiePath,
      status: data.status ?? undefined,
    },
  });
};

export const getKyc = async (userId: string) => {
  return prisma.kyc.findUnique({ where: { userId } });
};
