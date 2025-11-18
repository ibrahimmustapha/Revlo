import { prisma } from '../../config/prisma';

export const assertTradeParticipant = async (tradeId: string, userId: string) => {
  await prisma.trade.findFirstOrThrow({ where: { id: tradeId, OR: [{ makerUserId: userId }, { takerUserId: userId }] } });
};

export const listMessages = async (tradeId: string, userId: string) => {
  await assertTradeParticipant(tradeId, userId);
  return prisma.message.findMany({
    where: { tradeId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, email: true, phone: true } } },
  });
};

export const createMessage = async (tradeId: string, userId: string, content: string) => {
  await assertTradeParticipant(tradeId, userId);
  return prisma.message.create({ data: { tradeId, senderId: userId, content } });
};
