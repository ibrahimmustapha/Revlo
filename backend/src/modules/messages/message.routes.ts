import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as Controller from './message.controller';

const router = Router();

router.get('/trade/:tradeId', requireAuth, Controller.listByTrade);
router.post('/trade/:tradeId', requireAuth, Controller.createForTrade);

export default router;
