import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as KycController from './kyc.controller';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/me', requireAuth, KycController.getMyKyc);
router.post(
  '/me',
  requireAuth,
  upload.fields([
    { name: 'documentFront', maxCount: 1 },
    { name: 'documentBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  KycController.submitKyc,
);

export default router;
