import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as Controller from './trade.controller';

const router = Router();

router.get('/me', requireAuth, Controller.listMine);
router.post('/', requireAuth, Controller.create);
router.post('/:id/paid', requireAuth, Controller.markPaid);
router.post('/:id/confirm', requireAuth, Controller.confirmReceipt);
router.post('/:id/release', requireAuth, Controller.release);
router.post('/:id/cancel', requireAuth, Controller.cancel);

export default router;
