import { Router } from 'express';
import { updateFlavorProfile } from './users.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.put('/profile/flavor', requireAuth, updateFlavorProfile);

export default router;
