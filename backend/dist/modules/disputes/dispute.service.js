"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyDisputes = exports.addEvidence = exports.createDispute = void 0;
const prisma_1 = require("../../config/prisma");
const createDispute = async (userId, tradeId, reason, description) => {
    // ensure user is part of trade
    await prisma_1.prisma.trade.findFirstOrThrow({ where: { id: tradeId, OR: [{ makerUserId: userId }, { takerUserId: userId }] } });
    return prisma_1.prisma.dispute.create({
        data: {
            tradeId,
            raisedByUserId: userId,
            reason,
            description,
        },
    });
};
exports.createDispute = createDispute;
const addEvidence = async (userId, disputeId, data) => {
    // ensure user owns the dispute (raised it)
    await prisma_1.prisma.dispute.findFirstOrThrow({ where: { id: disputeId, raisedByUserId: userId } });
    return prisma_1.prisma.disputeEvidence.create({ data: { disputeId, fileUrl: data.fileUrl, type: data.type } });
};
exports.addEvidence = addEvidence;
const listMyDisputes = (userId) => {
    return prisma_1.prisma.dispute.findMany({
        where: { raisedByUserId: userId },
        include: { trade: true, evidence: true },
    });
};
exports.listMyDisputes = listMyDisputes;
