import { EscrowStatus, TradeStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const createTrade = async (
  takerUserId: string,
  data: {
    offerId: string;
    fromAmount: number | string;
    toAmount: number | string;
    expiresAt?: Date | string | null;
  },
) => {
  const offer = await prisma.offer.findUnique({ where: { id: data.offerId } });
  if (!offer) throw new Error('Offer not found');

  return prisma.trade.create({
    data: {
      offerId: offer.id,
      makerUserId: offer.makerUserId,
      takerUserId,
      fromCurrency: offer.fromCurrency,
      toCurrency: offer.toCurrency,
      fromAmount: data.fromAmount as any,
      toAmount: data.toAmount as any,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
    include: { offer: true },
  });
};

export const listMyTrades = (userId: string) => {
  return prisma.trade.findMany({
    where: { OR: [{ makerUserId: userId }, { takerUserId: userId }] },
    include: { offer: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateStatus = async (
  userId: string,
  tradeId: string,
  status: TradeStatus,
  escrowStatus?: EscrowStatus,
) => {
  // ensure the user is part of the trade
  await prisma.trade.findFirstOrThrow({
    where: { id: tradeId, OR: [{ makerUserId: userId }, { takerUserId: userId }] },
  });

  return prisma.trade.update({
    where: { id: tradeId },
    data: {
      status,
      escrowStatus: escrowStatus ?? undefined,
    },
  });
};
