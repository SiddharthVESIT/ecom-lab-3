import { Router } from 'express';
import { getMyReferrals, verifyReferralCode, applyReferralCode } from './referrals.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/my-referrals', requireAuth, getMyReferrals);
router.post('/verify', verifyReferralCode);
router.post('/apply', requireAuth, applyReferralCode);

export default router;
