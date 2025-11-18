"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.listMessages = exports.assertTradeParticipant = void 0;
const prisma_1 = require("../../config/prisma");
const assertTradeParticipant = async (tradeId, userId) => {
    await prisma_1.prisma.trade.findFirstOrThrow({ where: { id: tradeId, OR: [{ makerUserId: userId }, { takerUserId: userId }] } });
};
exports.assertTradeParticipant = assertTradeParticipant;
const listMessages = async (tradeId, userId) => {
    await (0, exports.assertTradeParticipant)(tradeId, userId);
    return prisma_1.prisma.message.findMany({
        where: { tradeId },
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, email: true, phone: true } } },
    });
};
exports.listMessages = listMessages;
const createMessage = async (tradeId, userId, content) => {
    await (0, exports.assertTradeParticipant)(tradeId, userId);
    return prisma_1.prisma.message.create({ data: { tradeId, senderId: userId, content } });
};
exports.createMessage = createMessage;
