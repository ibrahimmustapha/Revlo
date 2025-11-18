import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as MessageService from './message.service';

export const listByTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const tradeId = req.params.tradeId;
    const messages = await MessageService.listMessages(tradeId, userId);
    res.json(messages);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createForTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const tradeId = req.params.tradeId;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });
    const message = await MessageService.createMessage(tradeId, userId, content);
    res.status(201).json(message);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
