// Minimal enum mirrors to keep frontend type-safe without importing Prisma runtime.
export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum TradeStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  BUYER_MARKED_PAID = 'BUYER_MARKED_PAID',
  SELLER_CONFIRMED_RECEIPT = 'SELLER_CONFIRMED_RECEIPT',
  RELEASED = 'RELEASED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}
