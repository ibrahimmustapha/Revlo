import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as Controller from './rating.controller';

const router = Router();

router.get('/me', requireAuth, Controller.listMine);
router.post('/', requireAuth, Controller.create);

export default router;
