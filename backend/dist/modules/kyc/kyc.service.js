"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKyc = exports.upsertKyc = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const upsertKyc = async (userId, data) => {
    await prisma_1.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return prisma_1.prisma.kyc.upsert({
        where: { userId },
        create: { userId, status: client_1.KycStatus.PENDING, ...data },
        update: { ...data },
    });
};
exports.upsertKyc = upsertKyc;
const getKyc = async (userId) => {
    return prisma_1.prisma.kyc.findUnique({ where: { userId } });
};
exports.getKyc = getKyc;
