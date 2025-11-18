import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as TradeService from './trade.service';
import { EscrowStatus, TradeStatus } from '@prisma/client';

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { offerId, fromAmount, toAmount, expiresAt } = req.body;
    const trade = await TradeService.createTrade(userId, { offerId, fromAmount, toAmount, expiresAt });
    res.status(201).json(trade);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listMine = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const trades = await TradeService.listMyTrades(userId);
  res.json(trades);
};

export const markPaid = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const trade = await TradeService.updateStatus(userId, id, TradeStatus.BUYER_MARKED_PAID);
  res.json(trade);
};

export const confirmReceipt = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const trade = await TradeService.updateStatus(userId, id, TradeStatus.SELLER_CONFIRMED_RECEIPT);
  res.json(trade);
};

export const release = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const trade = await TradeService.updateStatus(userId, id, TradeStatus.RELEASED, EscrowStatus.RELEASED);
  res.json(trade);
};

export const cancel = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  const trade = await TradeService.updateStatus(userId, id, TradeStatus.CANCELLED, EscrowStatus.REFUNDED);
  res.json(trade);
};
