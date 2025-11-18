import { prisma } from '../../config/prisma';
import { EvidenceType } from '@prisma/client';

export const createDispute = async (
  userId: string,
  tradeId: string,
  reason: string,
  description?: string,
) => {
  // ensure user is part of trade
  await prisma.trade.findFirstOrThrow({ where: { id: tradeId, OR: [{ makerUserId: userId }, { takerUserId: userId }] } });

  return prisma.dispute.create({
    data: {
      tradeId,
      raisedByUserId: userId,
      reason,
      description,
    },
  });
};

export const addEvidence = async (
  userId: string,
  disputeId: string,
  data: { fileUrl: string; type?: EvidenceType },
) => {
  // ensure user owns the dispute (raised it)
  await prisma.dispute.findFirstOrThrow({ where: { id: disputeId, raisedByUserId: userId } });

  return prisma.disputeEvidence.create({ data: { disputeId, fileUrl: data.fileUrl, type: data.type } });
};

export const listMyDisputes = (userId: string) => {
  return prisma.dispute.findMany({
    where: { raisedByUserId: userId },
    include: { trade: true, evidence: true },
  });
};
