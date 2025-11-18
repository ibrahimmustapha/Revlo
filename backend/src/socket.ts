import { Server } from 'socket.io';
import http from 'http';
import { verifyToken } from './utils/jwt';
import * as MessageService from './modules/messages/message.service';

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query.token;
    if (!token || typeof token !== 'string') {
      return next(new Error('Unauthorized'));
    }
    try {
      const payload = verifyToken(token);
      (socket as any).user = payload;
      return next();
    } catch (err) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user as { userId: string; role: string };
    socket.join(`user:${user.userId}`);

    socket.on('joinTrade', async (tradeId: string) => {
      if (!tradeId) return;
      try {
        await MessageService.assertTradeParticipant(tradeId, user.userId);
        socket.join(`trade:${tradeId}`);
      } catch (err) {
        socket.emit('error', (err as Error).message);
      }
    });

    socket.on('message:send', async (payload: { tradeId: string; content: string }) => {
      const { tradeId, content } = payload || {};
      if (!tradeId || !content) return;
      try {
        const msg = await MessageService.createMessage(tradeId, user.userId, content);
        io.to(`trade:${tradeId}`).emit('message:new', msg);
      } catch (err) {
        socket.emit('error', (err as Error).message);
      }
    });
  });

  return io;
};
