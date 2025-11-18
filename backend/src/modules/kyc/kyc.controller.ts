import path from 'path';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import * as KycService from './kyc.service';

export const submitKyc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { documentType, documentNumber } = req.body;
    const files = req.files as any;
    const toPublic = (file?: Express.Multer.File) =>
      file ? `/uploads/${path.basename(file.path)}` : undefined;
    const documentFrontPath = toPublic(files?.documentFront?.[0]);
    const documentBackPath = toPublic(files?.documentBack?.[0]);
    const selfiePath = toPublic(files?.selfie?.[0]);

    if (!documentFrontPath || !documentBackPath) {
      return res.status(400).json({ message: 'Document front and back are required' });
    }

    const kyc = await KycService.upsertKyc(userId, {
      documentType,
      documentNumber,
      documentFrontPath,
      documentBackPath,
      selfiePath,
    });
    res.status(201).json(kyc);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyKyc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const kyc = await KycService.getKyc(userId);
    res.json(kyc);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
