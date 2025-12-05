import { pool } from '../config/database.js';

// Get reviews for a product or shop
export const getReviews = async (req, res) => {
  try {
    const { target_type, target_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!target_type || !target_id) {
      return res.status(400).json({
        success: false,
        message: 'Target type and target ID are required'
      });
    }

    if (!['Product', 'Shop'].includes(target_type)) {
      return res.status(400).json({
        success: false,
        message: 'Target type must be Product or Shop'
      });
    }

    const [reviews] = await pool.query(`
      SELECT 
        r.*,
        a.full_name as customer_name,
        a.email as customer_email
      FROM Review r
      INNER JOIN Customer c ON r.customer_id = c.customer_id
      INNER JOIN Account a ON c.customer_id = a.account_id
      WHERE r.target_type = ? AND r.target_id = ?
      ORDER BY r.review_date DESC
      LIMIT ? OFFSET ?
    `, [target_type, target_id, parseInt(limit), parseInt(offset)]);

    // Get total count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM Review 
      WHERE target_type = ? AND target_id = ?
    `, [target_type, target_id]);

    // Get rating statistics
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as avg_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM Review
      WHERE target_type = ? AND target_id = ?
    `, [target_type, target_id]);

    res.json({
      success: true,
      data: {
        reviews,
        statistics: stats[0],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

// Create review (Customer only)
// Note: Trigger trg_review_before_insert validates that customer purchased the product/from shop
export const createReview = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { target_type, target_id, rating, comment, image_url } = req.body;

    // Validate required fields
    if (!target_type || !target_id || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Target type, target ID, rating and comment are required'
      });
    }

    if (!['Product', 'Shop'].includes(target_type)) {
      return res.status(400).json({
        success: false,
        message: 'Target type must be Product or Shop'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // customer_id = account_id (1-1 relationship)
    const customerId = accountId;

    // Verify customer exists
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE customer_id = ?',
      [customerId]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if already reviewed
    const [existingReviews] = await pool.query(`
      SELECT review_id FROM Review 
      WHERE customer_id = ? AND target_type = ? AND target_id = ?
    `, [customerId, target_type, target_id]);

    if (existingReviews.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this item'
      });
    }

    // Create review (trigger will validate purchase)
    const [result] = await pool.query(`
      INSERT INTO Review (customer_id, target_type, target_id, rating, comment, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [customerId, target_type, target_id, rating, comment, image_url || null]);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review_id: result.insertId }
    });

  } catch (error) {
    console.error('Create review error:', error);
    
    // Handle trigger error messages
    if (error.sqlMessage) {
      return res.status(400).json({
        success: false,
        message: error.sqlMessage
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Update review (Customer only - own review)
export const updateReview = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { id } = req.params;
    const { rating, comment, image_url } = req.body;

    // customer_id = account_id (1-1 relationship)
    const customerId = accountId;

    // Check if review exists and belongs to customer
    const [reviews] = await pool.query(
      'SELECT review_id, target_type, target_id FROM Review WHERE review_id = ? AND customer_id = ?',
      [id, customerId]
    );

    if (reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      updateFields.push('rating = ?');
      updateValues.push(rating);
    }

    if (comment !== undefined) {
      updateFields.push('comment = ?');
      updateValues.push(comment);
    }

    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE Review SET ${updateFields.join(', ')} WHERE review_id = ?`,
      updateValues
    );

    // If rating changed and target is Shop, update shop rating
    if (rating !== undefined && reviews[0].target_type === 'Shop') {
      const [avgRating] = await pool.query(`
        SELECT AVG(rating) as avg_rating FROM Review 
        WHERE target_type = 'Shop' AND target_id = ?
      `, [reviews[0].target_id]);

      await pool.query(
        'UPDATE Shop SET rating = ? WHERE shop_id = ?',
        [avgRating[0].avg_rating || 0, reviews[0].target_id]
      );
    }

    res.json({
      success: true,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete review (Customer - own review, or Admin)
export const deleteReview = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const role = req.user.role;
    const { id } = req.params;

    let deleteQuery = 'DELETE FROM Review WHERE review_id = ?';
    const params = [id];

    if (role === 'Customer') {
      // customer_id = account_id (1-1 relationship)
      deleteQuery += ' AND customer_id = ?';
      params.push(accountId);
    }

    // Get review info for updating shop rating
    const [reviews] = await pool.query(
      'SELECT target_type, target_id FROM Review WHERE review_id = ?',
      [id]
    );

    const [result] = await pool.query(deleteQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // If target was Shop, update shop rating
    if (reviews.length > 0 && reviews[0].target_type === 'Shop') {
      const [avgRating] = await pool.query(`
        SELECT AVG(rating) as avg_rating FROM Review 
        WHERE target_type = 'Shop' AND target_id = ?
      `, [reviews[0].target_id]);

      await pool.query(
        'UPDATE Shop SET rating = ? WHERE shop_id = ?',
        [avgRating[0].avg_rating || 0, reviews[0].target_id]
      );
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Get customer's reviews
export const getMyReviews = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // customer_id = account_id (same key, 1-1 relationship)
    const customerId = accountId;

    const [reviews] = await pool.query(`
      SELECT 
        r.*,
        CASE 
          WHEN r.target_type = 'Product' THEN p.product_name
          WHEN r.target_type = 'Shop' THEN s.shop_name
        END as target_name
      FROM Review r
      LEFT JOIN Product p ON r.target_type = 'Product' AND r.target_id = p.product_id
      LEFT JOIN Shop s ON r.target_type = 'Shop' AND r.target_id = s.shop_id
      WHERE r.customer_id = ?
      ORDER BY r.review_date DESC
      LIMIT ? OFFSET ?
    `, [customerId, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM Review WHERE customer_id = ?',
      [customerId]
    );

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

// Get shop's reviews (for shop dashboard)
export const getShopReviews = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { page = 1, limit = 10, rating } = req.query;
    const offset = (page - 1) * limit;

    // shop_id = account_id (1-1 relationship)
    const shopId = accountId;

    // Verify shop exists
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [shopId]
    );

    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    let whereClause = `WHERE (
      (r.target_type = 'Shop' AND r.target_id = ?) OR
      (r.target_type = 'Product' AND p.shop_id = ?)
    )`;
    const params = [shopId, shopId];

    if (rating) {
      whereClause += ' AND r.rating = ?';
      params.push(rating);
    }

    const [reviews] = await pool.query(`
      SELECT 
        r.review_id,
        r.customer_id,
        r.target_type,
        r.target_id,
        r.rating,
        r.comment,
        r.image_url,
        r.review_date,
        a.full_name as customer_name,
        CASE 
          WHEN r.target_type = 'Product' THEN p.product_name
          WHEN r.target_type = 'Shop' THEN 'Shop Review'
        END as product_name,
        CASE
          WHEN r.target_type = 'Product' THEN COALESCE(pi.image_url, p.image)
          WHEN r.target_type = 'Shop' THEN NULL
        END as product_image
      FROM Review r
      INNER JOIN Customer c ON r.customer_id = c.customer_id
      INNER JOIN Account a ON c.customer_id = a.account_id
      LEFT JOIN Product p ON r.target_type = 'Product' AND r.target_id = p.product_id
      LEFT JOIN ProductItem pi ON r.target_type = 'Product' AND p.product_id = pi.product_id AND pi.item_id = (
        SELECT MIN(item_id) FROM ProductItem WHERE product_id = p.product_id
      )
      ${whereClause}
      ORDER BY r.review_date DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Get count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total
      FROM Review r
      LEFT JOIN Product p ON r.target_type = 'Product' AND r.target_id = p.product_id
      ${whereClause}
    `, params);

    // Get rating stats
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(r.rating) as avg_rating,
        SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM Review r
      LEFT JOIN Product p ON r.target_type = 'Product' AND r.target_id = p.product_id
      WHERE (r.target_type = 'Shop' AND r.target_id = ?) OR
            (r.target_type = 'Product' AND p.shop_id = ?)
    `, [shopId, shopId]);

    res.json({
      success: true,
      data: {
        reviews,
        statistics: stats[0],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get shop reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shop reviews',
      error: error.message
    });
  }
};

