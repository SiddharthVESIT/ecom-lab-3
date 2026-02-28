import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: false
  }
});

redisClient.on('error', (error) => {
  console.warn('Redis connection failed (Continuing without cache):', error.message);
});

export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.warn('Could not establish Redis connection. Cache will be bypassed.');
  }
}
