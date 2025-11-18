import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as RatingService from './rating.service';

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { tradeId, score, comment } = req.body;
    const rating = await RatingService.createRating(userId, tradeId, Number(score), comment);
    res.status(201).json(rating);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listMine = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const ratings = await RatingService.listMyRatings(userId);
  res.json(ratings);
};
