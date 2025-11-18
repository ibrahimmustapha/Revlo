import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as PaymentService from './paymentMethod.service';

export const list = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const items = await PaymentService.listPaymentMethods(userId);
  res.json(items);
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { type, label, details, isDefault } = req.body;
  const item = await PaymentService.addPaymentMethod(userId, { type, label, details, isDefault });
  res.status(201).json(item);
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  await PaymentService.removePaymentMethod(userId, id);
  res.status(204).send();
};

export const setDefault = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.params;
  const item = await PaymentService.setDefaultPaymentMethod(userId, id);
  res.json(item);
};
