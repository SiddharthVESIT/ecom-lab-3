import { listProductsByCategory } from './product.repository.js';
import { redisClient } from '../../config/redis.js';
import { PRODUCT_CATEGORIES } from '../../utils/constants.js';

export async function getCatalog(category) {
  if (category && !PRODUCT_CATEGORIES.includes(category)) {
    throw new Error('Invalid category filter');
  }

  const cacheKey = `products:${category || 'all'}`;
  const cached = await redisClient.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const products = await listProductsByCategory(category);
  await redisClient.set(cacheKey, JSON.stringify(products), { EX: 60 });
  return products;
}
