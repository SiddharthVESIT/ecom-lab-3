import { verifyToken } from '../utils/jwt.js';
import { redisClient } from '../config/redis.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    // Check if token is blacklisted in Redis
    if (redisClient.isOpen) {
      const isBlacklisted = await redisClient.get(`bl_${token}`);
      if (isBlacklisted) {
        return res.status(401).json({ message: 'Token has been revoked' });
      }
    }

    req.user = verifyToken(token);
    req.token = token; // Attach token for future revocation

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  });
}
