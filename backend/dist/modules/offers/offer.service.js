"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyOffers = exports.listOffers = exports.createOffer = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const createOffer = async (makerUserId, data) => {
    return prisma_1.prisma.offer.create({
        data: {
            makerUserId,
            side: data.side,
            fromCurrency: data.fromCurrency,
            toCurrency: data.toCurrency,
            rate: new client_1.Prisma.Decimal(data.rate),
            minAmount: new client_1.Prisma.Decimal(data.minAmount),
            maxAmount: new client_1.Prisma.Decimal(data.maxAmount),
            paymentMethodsAccepted: data.paymentMethodsAccepted,
        },
    });
};
exports.createOffer = createOffer;
const listOffers = (status = client_1.OfferStatus.ACTIVE) => {
    return prisma_1.prisma.offer.findMany({
        where: { status },
        include: { maker: { select: { id: true, email: true, phone: true, rating: true } } },
        orderBy: { createdAt: 'desc' },
    });
};
exports.listOffers = listOffers;
const listMyOffers = (userId) => {
    return prisma_1.prisma.offer.findMany({ where: { makerUserId: userId }, orderBy: { createdAt: 'desc' } });
};
exports.listMyOffers = listMyOffers;
