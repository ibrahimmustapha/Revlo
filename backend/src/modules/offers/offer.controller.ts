import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as OfferService from './offer.service';
import { OfferStatus } from '@prisma/client';

export const list = async (_req: Request, res: Response) => {
  const offers = await OfferService.listOffers();
  res.json(offers);
};

export const listMine = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const offers = await OfferService.listMyOffers(userId);
  res.json(offers);
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { side, fromCurrency, toCurrency, rate, minAmount, maxAmount, paymentMethodsAccepted } = req.body;
  const offer = await OfferService.createOffer(userId, {
    side,
    fromCurrency,
    toCurrency,
    rate,
    minAmount,
    maxAmount,
    paymentMethodsAccepted,
  });
  res.status(201).json(offer);
};

export const listByStatus = async (req: Request, res: Response) => {
  const status = req.params.status as OfferStatus;
  const offers = await OfferService.listOffers(status);
  res.json(offers);
};
