"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertProfile = exports.getMe = void 0;
const prisma_1 = require("../../config/prisma");
const getMe = async (userId) => {
    return prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            kyc: true,
            paymentMethods: true,
        },
    });
};
exports.getMe = getMe;
const upsertProfile = async (userId, data) => {
    await prisma_1.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return prisma_1.prisma.userProfile.upsert({
        where: { userId },
        create: { userId, ...data },
        update: data,
    });
};
exports.upsertProfile = upsertProfile;
