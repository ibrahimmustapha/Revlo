import { PrismaClient, UserRole, PaymentMethodType, OfferStatus, TradeStatus, EscrowStatus, EvidenceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

type SeedUser = {
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
};

const prisma = new PrismaClient();

async function createUser({ email, phone, password, role = UserRole.USER }: SeedUser) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      role,
      profile: {
        create: {
          fullName: `${email.split('@')[0]} User`,
          country: 'GH',
          preferredCurrency: 'GHS',
          avatarUrl: 'https://via.placeholder.com/128',
        },
      },
    },
  });
}

async function main() {
  await prisma.disputeEvidence.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.kyc.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  const alice = await createUser({ email: 'alice@example.com', phone: '233200000001', password: 'password123' });
  const bob = await createUser({ email: 'bob@example.com', phone: '233200000002', password: 'password123' });
  const admin = await createUser({ email: 'admin@example.com', phone: '233200000003', password: 'adminpass', role: UserRole.ADMIN });

  await prisma.kyc.create({
    data: {
      userId: alice.id,
      documentType: 'NATIONAL_ID',
      documentNumber: 'ALICE12345',
      documentFrontUrl: 'https://example.com/alice/front',
      documentBackUrl: 'https://example.com/alice/back',
      selfieUrl: 'https://example.com/alice/selfie',
    },
  });

  await prisma.paymentMethod.createMany({
    data: [
      {
        userId: alice.id,
        type: PaymentMethodType.MOMO,
        label: 'MTN MoMo',
        details: { momoNumber: '233200000001' },
        isDefault: true,
      },
      {
        userId: bob.id,
        type: PaymentMethodType.BANK,
        label: 'UBA',
        details: { accountName: 'Bob', accountNumber: '123456789', bankName: 'UBA' },
        isDefault: true,
      },
    ],
  });

  const offer1 = await prisma.offer.create({
    data: {
      makerUserId: alice.id,
      side: 'SELL',
      fromCurrency: 'GHS',
      toCurrency: 'USD',
      rate: '0.0800',
      minAmount: '100',
      maxAmount: '5000',
      paymentMethodsAccepted: [PaymentMethodType.MOMO],
    },
  });

  const offer2 = await prisma.offer.create({
    data: {
      makerUserId: bob.id,
      side: 'BUY',
      fromCurrency: 'USD',
      toCurrency: 'GHS',
      rate: '12.2000',
      minAmount: '50',
      maxAmount: '1000',
      status: OfferStatus.ACTIVE,
      paymentMethodsAccepted: [PaymentMethodType.BANK],
    },
  });

  const trade1 = await prisma.trade.create({
    data: {
      offerId: offer1.id,
      makerUserId: alice.id,
      takerUserId: bob.id,
      fromCurrency: offer1.fromCurrency,
      toCurrency: offer1.toCurrency,
      fromAmount: '200',
      toAmount: '16',
      status: TradeStatus.BUYER_MARKED_PAID,
      escrowStatus: EscrowStatus.LOCKED,
    },
    include: { offer: true },
  });

  await prisma.rating.create({
    data: {
      tradeId: trade1.id,
      raterUserId: bob.id,
      ratedUserId: alice.id,
      score: 5,
      comment: 'Smooth trade, fast release.',
    },
  });

  const dispute = await prisma.dispute.create({
    data: {
      tradeId: trade1.id,
      raisedByUserId: bob.id,
      reason: 'Delay in confirmation',
      description: 'Maker delayed confirmation beyond SLA.',
    },
  });

  await prisma.disputeEvidence.create({
    data: {
      disputeId: dispute.id,
      fileUrl: 'https://example.com/screenshot.png',
      type: EvidenceType.SCREENSHOT,
    },
  });

  const trade2 = await prisma.trade.create({
    data: {
      offerId: offer2.id,
      makerUserId: bob.id,
      takerUserId: alice.id,
      fromCurrency: offer2.fromCurrency,
      toCurrency: offer2.toCurrency,
      fromAmount: '100',
      toAmount: '1220',
      status: TradeStatus.RELEASED,
      escrowStatus: EscrowStatus.RELEASED,
    },
  });

  await prisma.rating.create({
    data: {
      tradeId: trade2.id,
      raterUserId: alice.id,
      ratedUserId: bob.id,
      score: 4,
      comment: 'All good.',
    },
  });

  // basic admin flag through role already set above
  console.log('Seeded users:', { alice: alice.id, bob: bob.id, admin: admin.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
