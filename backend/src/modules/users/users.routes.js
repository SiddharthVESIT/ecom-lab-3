import { Router } from 'express';
import { updateFlavorProfile, getUserProfile } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/profile', requireAuth, getUserProfile);
router.put('/profile/flavor', requireAuth, updateFlavorProfile);

export default router;
