import { dbPool } from '../../config/db.js';

export async function getProductReviews(req, res) {
  const { productId } = req.params;

  try {
    const result = await dbPool.query(
      `SELECT r.*, u.full_name as user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = $1 
       ORDER BY r.created_at DESC`,
      [productId]
    );

    return res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createReview(req, res) {
  const { productId, rating, comment } = req.body;
  const userId = req.user.sub; // From JWT

  if (!productId || !rating) {
    return res.status(400).json({ message: 'Product ID and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // Check if user has already reviewed this product (Optional, based on business logic)
    const existingReview = await dbPool.query(
      'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    );

    if (existingReview.rows.length > 0) {
      // Update existing review
      const result = await dbPool.query(
        `UPDATE reviews SET rating = $1, comment = $2, created_at = NOW() 
         WHERE product_id = $3 AND user_id = $4 
         RETURNING *`,
        [rating, comment, productId, userId]
      );
      return res.status(200).json({
        status: 'success',
        message: 'Review updated',
        data: result.rows[0]
      });
    }

    const result = await dbPool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [productId, userId, rating, comment]
    );

    return res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
