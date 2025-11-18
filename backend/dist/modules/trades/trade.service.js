"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.listMyTrades = exports.createTrade = void 0;
const prisma_1 = require("../../config/prisma");
const createTrade = async (takerUserId, data) => {
    const offer = await prisma_1.prisma.offer.findUnique({ where: { id: data.offerId } });
    if (!offer)
        throw new Error('Offer not found');
    return prisma_1.prisma.trade.create({
        data: {
            offerId: offer.id,
            makerUserId: offer.makerUserId,
            takerUserId,
            fromCurrency: offer.fromCurrency,
            toCurrency: offer.toCurrency,
            fromAmount: data.fromAmount,
            toAmount: data.toAmount,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        },
        include: { offer: true },
    });
};
exports.createTrade = createTrade;
const listMyTrades = (userId) => {
    return prisma_1.prisma.trade.findMany({
        where: { OR: [{ makerUserId: userId }, { takerUserId: userId }] },
        include: { offer: true },
        orderBy: { createdAt: 'desc' },
    });
};
exports.listMyTrades = listMyTrades;
const updateStatus = async (userId, tradeId, status, escrowStatus) => {
    // ensure the user is part of the trade
    await prisma_1.prisma.trade.findFirstOrThrow({
        where: { id: tradeId, OR: [{ makerUserId: userId }, { takerUserId: userId }] },
    });
    return prisma_1.prisma.trade.update({
        where: { id: tradeId },
        data: {
            status,
            escrowStatus: escrowStatus ?? undefined,
        },
    });
};
exports.updateStatus = updateStatus;
