import { listProductsByCategory, findProductById } from './product.repository.js';
import { redisClient } from '../../config/redis.js';
import { PRODUCT_CATEGORIES } from '../../utils/constants.js';

export async function getCatalog(category) {
  if (category && !PRODUCT_CATEGORIES.includes(category)) {
    throw new Error('Invalid category filter');
  }

  const cacheKey = `products:${category || 'all'}`;
  let cached = null;
  try {
    if (redisClient.isOpen) {
      cached = await redisClient.get(cacheKey);
    }
  } catch (err) {
    // Ignore cache error
  }

  if (cached) return JSON.parse(cached);

  const products = await listProductsByCategory(category); // This line needs to be changed to productRepository.findProducts(category) based on the diff.

  try {
    if (redisClient.isOpen) {
      await redisClient.set(cacheKey, JSON.stringify(products), { EX: 60 });
    }
  } catch (err) {
    // Ignore cache error
  }
  return products;
}

export async function getProductById(id) {
  const product = await findProductById(id);
  if (!product) throw new Error('Product not found');
  return product;
}
