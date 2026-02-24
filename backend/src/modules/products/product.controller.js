import { getCatalog } from './product.service.js';

export async function getProducts(req, res) {
  try {
    const products = await getCatalog(req.query.category);
    return res.status(200).json({ data: products });
  } catch (error) {
    if (error.message === 'Invalid category filter') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}
