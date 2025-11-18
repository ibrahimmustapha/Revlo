import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as DisputeService from './dispute.service';

export const create = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { tradeId, reason, description } = req.body;
    const dispute = await DisputeService.createDispute(userId, tradeId, reason, description);
    res.status(201).json(dispute);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const addEvidence = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { disputeId } = req.params;
    const { fileUrl, type } = req.body;
    const evidence = await DisputeService.addEvidence(userId, disputeId, { fileUrl, type });
    res.status(201).json(evidence);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listMine = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const disputes = await DisputeService.listMyDisputes(userId);
  res.json(disputes);
};
