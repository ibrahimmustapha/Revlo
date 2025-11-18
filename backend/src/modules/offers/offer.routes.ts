import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as Controller from './offer.controller';

const router = Router();

router.get('/', Controller.list);
router.get('/status/:status', Controller.listByStatus);
router.get('/me', requireAuth, Controller.listMine);
router.post('/', requireAuth, Controller.create);

export default router;
