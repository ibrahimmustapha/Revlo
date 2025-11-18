import { OfferStatus, TradeStatus } from './prisma-types';

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  role: string;
};

export type Offer = {
  id: string;
  makerUserId: string;
  maker: { id: string; email: string | null; phone: string | null; rating: number };
  side: string;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  minAmount: string;
  maxAmount: string;
  status: OfferStatus;
  paymentMethodsAccepted: any;
  createdAt: string;
};

export type Trade = {
  id: string;
  offerId: string;
  makerUserId: string;
  takerUserId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAmount: string;
  status: TradeStatus;
  createdAt: string;
};
