import { Router } from 'express';
import { login, register, session, googleLogin, logout } from './auth.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', requireAuth, logout);
router.get('/session', requireAuth, session);

export default router;
