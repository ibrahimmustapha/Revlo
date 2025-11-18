import { prisma } from '../../config/prisma';

export const createRating = async (
  raterUserId: string,
  tradeId: string,
  score: number,
  comment?: string,
) => {
  const trade = await prisma.trade.findFirstOrThrow({
    where: { id: tradeId, OR: [{ makerUserId: raterUserId }, { takerUserId: raterUserId }] },
  });

  const ratedUserId = trade.makerUserId === raterUserId ? trade.takerUserId : trade.makerUserId;

  return prisma.rating.create({
    data: {
      tradeId,
      raterUserId,
      ratedUserId,
      score,
      comment,
    },
  });
};

export const listMyRatings = (userId: string) => {
  return prisma.rating.findMany({ where: { ratedUserId: userId }, include: { trade: true } });
};
