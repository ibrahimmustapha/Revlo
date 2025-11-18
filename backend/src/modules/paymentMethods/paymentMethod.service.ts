import { PaymentMethodType } from '@prisma/client';
import { prisma } from '../../config/prisma';

const normalizeType = (type: string): PaymentMethodType => {
  const upper = type.toUpperCase().replace(/\s+/g, '_') as PaymentMethodType;
  if (Object.values(PaymentMethodType).includes(upper)) return upper;
  return PaymentMethodType.OTHER;
};

export const listPaymentMethods = (userId: string) => {
  return prisma.paymentMethod.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

export const addPaymentMethod = async (
  userId: string,
  data: { type: string; label: string; details: any; isDefault?: boolean },
) => {
  const type = normalizeType(data.type);

  if (data.isDefault) {
    await prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  return prisma.paymentMethod.create({
    data: {
      userId,
      label: data.label || type,
      details: data.details || {},
      isDefault: Boolean(data.isDefault),
      type,
    },
  });
};

export const removePaymentMethod = (userId: string, id: string) => {
  return prisma.paymentMethod.deleteMany({ where: { id, userId } });
};

export const setDefaultPaymentMethod = async (userId: string, id: string) => {
  await prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
  await prisma.paymentMethod.updateMany({ where: { id, userId }, data: { isDefault: true } });
  return prisma.paymentMethod.findUnique({ where: { id } });
};
