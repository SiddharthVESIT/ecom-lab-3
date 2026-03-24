import { listProductsByCategory, findProductById } from './product.repository.js';
import { redisClient } from '../../config/redis.js';
import { PRODUCT_CATEGORIES } from '../../utils/constants.js';

export async function getCatalog(category, flavorProfile) {
  if (category && !PRODUCT_CATEGORIES.includes(category)) {
    throw new Error('Invalid category filter');
  }

  const cacheKey = `products:${category || 'all'}:flavor:${flavorProfile || 'none'}`;
  let cached = null;
  try {
    if (redisClient.isOpen) {
      cached = await redisClient.get(cacheKey);
    }
  } catch (err) {
    // Ignore cache error
  }

  if (cached) return JSON.parse(cached);

  let products = await listProductsByCategory(category);

  // Sort products based on typical flavor profile matching
  if (flavorProfile) {
    const lowerProfile = flavorProfile.toLowerCase();
    
    products.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      const textA = (a.name + ' ' + a.description).toLowerCase();
      const textB = (b.name + ' ' + b.description).toLowerCase();

      if (lowerProfile === 'earthy') {
        const keywords = ['matcha', 'hojicha', 'miso', 'roasted', 'green tea', 'earthy', 'tea'];
        keywords.forEach(kw => {
          if (textA.includes(kw)) scoreA++;
          if (textB.includes(kw)) scoreB++;
        });
      } else if (lowerProfile === 'adventurous') {
        const keywords = ['yuzu', 'wasabi', 'citrus', 'sea salt', 'bold', 'savory', 'tart'];
        keywords.forEach(kw => {
          if (textA.includes(kw)) scoreA++;
          if (textB.includes(kw)) scoreB++;
        });
      } else if (lowerProfile === 'sweet') {
        const keywords = ['sakura', 'praline', 'caramel', 'sweet', 'milk chocolate', 'white chocolate', 'butterscotch'];
        keywords.forEach(kw => {
          if (textA.includes(kw)) scoreA++;
          if (textB.includes(kw)) scoreB++;
        });
      }
      return scoreB - scoreA;
    });
  }

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
