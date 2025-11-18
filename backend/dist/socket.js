"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jwt_1 = require("./utils/jwt");
const MessageService = __importStar(require("./modules/messages/message.service"));
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: '*', methods: ['GET', 'POST'] },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.query.token;
        if (!token || typeof token !== 'string') {
            return next(new Error('Unauthorized'));
        }
        try {
            const payload = (0, jwt_1.verifyToken)(token);
            socket.user = payload;
            return next();
        }
        catch (err) {
            return next(new Error('Unauthorized'));
        }
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        socket.join(`user:${user.userId}`);
        socket.on('joinTrade', async (tradeId) => {
            if (!tradeId)
                return;
            try {
                await MessageService.assertTradeParticipant(tradeId, user.userId);
                socket.join(`trade:${tradeId}`);
            }
            catch (err) {
                socket.emit('error', err.message);
            }
        });
        socket.on('message:send', async (payload) => {
            const { tradeId, content } = payload || {};
            if (!tradeId || !content)
                return;
            try {
                const msg = await MessageService.createMessage(tradeId, user.userId, content);
                io.to(`trade:${tradeId}`).emit('message:new', msg);
            }
            catch (err) {
                socket.emit('error', err.message);
            }
        });
    });
    return io;
};
exports.initSocket = initSocket;
