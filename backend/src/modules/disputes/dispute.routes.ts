import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as Controller from './dispute.controller';

const router = Router();

router.get('/me', requireAuth, Controller.listMine);
router.post('/', requireAuth, Controller.create);
router.post('/:disputeId/evidence', requireAuth, Controller.addEvidence);

export default router;
