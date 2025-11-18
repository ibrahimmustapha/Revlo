import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import kycRoutes from './modules/kyc/kyc.routes';
import paymentMethodRoutes from './modules/paymentMethods/paymentMethod.routes';
import offerRoutes from './modules/offers/offer.routes';
import tradeRoutes from './modules/trades/trade.routes';
import disputeRoutes from './modules/disputes/dispute.routes';
import ratingRoutes from './modules/ratings/rating.routes';
import messageRoutes from './modules/messages/message.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/kyc', kycRoutes);
app.use('/payment-methods', paymentMethodRoutes);
app.use('/offers', offerRoutes);
app.use('/trades', tradeRoutes);
app.use('/disputes', disputeRoutes);
app.use('/ratings', ratingRoutes);
app.use('/messages', messageRoutes);

app.use(errorHandler);

export default app;
