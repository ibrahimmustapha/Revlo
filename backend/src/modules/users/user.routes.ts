import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as UserController from './user.controller';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/me', requireAuth, UserController.getMe);
router.patch('/me', requireAuth, upload.single('avatar'), UserController.updateProfile);

export default router;
