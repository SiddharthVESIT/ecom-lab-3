import { loginUser, registerUser, loginWithGoogleToken } from './auth.service.js';
import { redisClient } from '../../config/redis.js';

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

export async function register(req, res) {
  try {
    const { fullName, email, password, referralCode } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email and password are required' });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const result = await registerUser({ fullName, email, password, referralCodeUsed: referralCode });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const result = await loginUser({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

export async function googleLogin(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'idToken is required' });
    }

    const result = await loginWithGoogleToken(idToken);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

export function session(req, res) {
  return res.status(200).json({
    message: 'Session active',
    user: req.user
  });
}

export async function logout(req, res) {
  try {
    const token = req.token;
    if (token && redisClient.isOpen) {
      // Decode slightly to get exp, or just blacklist for 24 hours (86400s) locally
      await redisClient.set(`bl_${token}`, 'revoked', { EX: 86400 });
    }
    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'An error occurred during logout' });
  }
}
