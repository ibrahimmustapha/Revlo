import path from 'path';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as UserService from './user.service';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await UserService.getMe(userId);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const file = req.file;
    const avatarUrl = file ? `/uploads/${path.basename(file.path)}` : req.body.avatarUrl;
    const { fullName, country, preferredCurrency } = req.body;
    const profile = await UserService.upsertProfile(userId, {
      fullName,
      country,
      preferredCurrency,
      avatarUrl,
    });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
