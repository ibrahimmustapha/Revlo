import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as Controller from './paymentMethod.controller';

const router = Router();

router.get('/', requireAuth, Controller.list);
router.post('/', requireAuth, Controller.create);
router.delete('/:id', requireAuth, Controller.remove);
router.post('/:id/default', requireAuth, Controller.setDefault);

export default router;
