"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyRatings = exports.createRating = void 0;
const prisma_1 = require("../../config/prisma");
const createRating = async (raterUserId, tradeId, score, comment) => {
    const trade = await prisma_1.prisma.trade.findFirstOrThrow({
        where: { id: tradeId, OR: [{ makerUserId: raterUserId }, { takerUserId: raterUserId }] },
    });
    const ratedUserId = trade.makerUserId === raterUserId ? trade.takerUserId : trade.makerUserId;
    return prisma_1.prisma.rating.create({
        data: {
            tradeId,
            raterUserId,
            ratedUserId,
            score,
            comment,
        },
    });
};
exports.createRating = createRating;
const listMyRatings = (userId) => {
    return prisma_1.prisma.rating.findMany({ where: { ratedUserId: userId }, include: { trade: true } });
};
exports.listMyRatings = listMyRatings;
