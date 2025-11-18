import { OfferStatus, Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const createOffer = async (
  makerUserId: string,
  data: {
    side: string;
    fromCurrency: string;
    toCurrency: string;
    rate: Prisma.Decimal | number | string;
    minAmount: Prisma.Decimal | number | string;
    maxAmount: Prisma.Decimal | number | string;
    paymentMethodsAccepted: any;
  },
) => {
  return prisma.offer.create({
    data: {
      makerUserId,
      side: data.side,
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      rate: new Prisma.Decimal(data.rate),
      minAmount: new Prisma.Decimal(data.minAmount),
      maxAmount: new Prisma.Decimal(data.maxAmount),
      paymentMethodsAccepted: data.paymentMethodsAccepted,
    },
  });
};

export const listOffers = (status: OfferStatus = OfferStatus.ACTIVE) => {
  return prisma.offer.findMany({
    where: { status },
    include: { maker: { select: { id: true, email: true, phone: true, rating: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const listMyOffers = (userId: string) => {
  return prisma.offer.findMany({ where: { makerUserId: userId }, orderBy: { createdAt: 'desc' } });
};
