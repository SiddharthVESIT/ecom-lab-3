import { listProductsByCategory } from './product.repository.js';
import { redisClient } from '../../config/redis.js';

export async function getCatalog(category) {
  const cacheKey = `products:${category || 'all'}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const products = await listProductsByCategory(category);
  await redisClient.set(cacheKey, JSON.stringify(products), { EX: 60 });
  return products;
}
