"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultPaymentMethod = exports.removePaymentMethod = exports.addPaymentMethod = exports.listPaymentMethods = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const normalizeType = (type) => {
    const upper = type.toUpperCase().replace(/\s+/g, '_');
    if (Object.values(client_1.PaymentMethodType).includes(upper))
        return upper;
    return client_1.PaymentMethodType.OTHER;
};
const listPaymentMethods = (userId) => {
    return prisma_1.prisma.paymentMethod.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};
exports.listPaymentMethods = listPaymentMethods;
const addPaymentMethod = async (userId, data) => {
    const type = normalizeType(data.type);
    if (data.isDefault) {
        await prisma_1.prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    }
    return prisma_1.prisma.paymentMethod.create({
        data: {
            userId,
            label: data.label || type,
            details: data.details || {},
            isDefault: Boolean(data.isDefault),
            type,
        },
    });
};
exports.addPaymentMethod = addPaymentMethod;
const removePaymentMethod = (userId, id) => {
    return prisma_1.prisma.paymentMethod.deleteMany({ where: { id, userId } });
};
exports.removePaymentMethod = removePaymentMethod;
const setDefaultPaymentMethod = async (userId, id) => {
    await prisma_1.prisma.paymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    await prisma_1.prisma.paymentMethod.updateMany({ where: { id, userId }, data: { isDefault: true } });
    return prisma_1.prisma.paymentMethod.findUnique({ where: { id } });
};
exports.setDefaultPaymentMethod = setDefaultPaymentMethod;
