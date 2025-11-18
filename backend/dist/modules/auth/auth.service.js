"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = require("../../config/prisma");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const ensureIdentifier = (data) => {
    if (!data.email && !data.phone) {
        throw new Error('Email or phone is required');
    }
};
const register = async (data) => {
    ensureIdentifier(data);
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                data.email ? { email: data.email } : undefined,
                data.phone ? { phone: data.phone } : undefined,
            ].filter(Boolean),
        },
    });
    if (existingUser) {
        throw new Error('User with provided email/phone already exists');
    }
    const passwordHash = await (0, password_1.hashPassword)(data.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            email: data.email,
            phone: data.phone,
            passwordHash,
        },
    });
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    return { token, user };
};
exports.register = register;
const login = async (data) => {
    ensureIdentifier(data);
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            OR: [
                data.email ? { email: data.email } : undefined,
                data.phone ? { phone: data.phone } : undefined,
            ].filter(Boolean),
        },
    });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const valid = await (0, password_1.verifyPassword)(data.password, user.passwordHash);
    if (!valid) {
        throw new Error('Invalid credentials');
    }
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    return { token, user };
};
exports.login = login;
