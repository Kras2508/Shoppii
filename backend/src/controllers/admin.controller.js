import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

// ==================== USERS MANAGEMENT ====================

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (role) {
      whereClause += ' AND a.role = ?';
      params.push(role);
    }
    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    if (search) {
      whereClause += ' AND (a.email LIKE ? OR a.full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [users] = await pool.query(`
      SELECT 
        a.account_id,
        a.email,
        a.role,
        a.full_name,
        a.phone,
        a.status,
        a.created_at,
        CASE 
          WHEN a.role = 'Customer' THEN c.total_spent
          ELSE NULL
        END as total_spent,
        CASE 
          WHEN a.role = 'Customer' THEN c.total_order
          ELSE NULL
        END as total_orders,
        CASE 
          WHEN a.role = 'Shop' THEN s.shop_name
          ELSE NULL
        END as shop_name,
        CASE 
          WHEN a.role = 'Shop' THEN s.rating
          ELSE NULL
        END as shop_rating
      FROM Account a
      LEFT JOIN Customer c ON a.account_id = c.account_id
      LEFT JOIN Shop s ON a.account_id = s.account_id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM Account a ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(`
      SELECT 
        a.*,
        c.customer_id,
        c.address,
        c.add_phone,
        c.total_spent,
        c.total_order,
        s.shop_id,
        s.shop_name,
        s.shop_phone,
        s.address_shop,
        s.rating,
        s.shop_status,
        ad.admin_id,
        ad.role as admin_role,
        ad.note as admin_note
      FROM Account a
      LEFT JOIN Customer c ON a.account_id = c.account_id
      LEFT JOIN Shop s ON a.account_id = s.account_id
      LEFT JOIN Admin ad ON a.account_id = ad.account_id
      WHERE a.account_id = ?
    `, [id]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// Ban/Unban user
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Ban'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Active or Ban'
      });
    }

    // Don't allow banning admins
    const [user] = await pool.query(
      'SELECT role FROM Account WHERE account_id = ?',
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user[0].role === 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin accounts'
      });
    }

    await pool.query(
      'UPDATE Account SET status = ? WHERE account_id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: `User ${status === 'Ban' ? 'banned' : 'unbanned'} successfully`
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// ==================== SHOPS MANAGEMENT ====================

// Get all shops
export const getAllShops = async (req, res) => {
  try {
    const { status, shop_status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE a.role = "Shop"';
    const params = [];

    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    if (shop_status) {
      whereClause += ' AND s.shop_status = ?';
      params.push(shop_status);
    }
    if (search) {
      whereClause += ' AND (s.shop_name LIKE ? OR a.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [shops] = await pool.query(`
      SELECT 
        s.*,
        a.email,
        a.phone,
        a.status as account_status,
        a.created_at,
        COUNT(DISTINCT p.product_id) as total_products,
        COUNT(DISTINCT oi.order_id) as total_orders,
        fn_get_shop_revenue(s.shop_id) as total_revenue
      FROM Shop s
      INNER JOIN Account a ON s.account_id = a.account_id
      LEFT JOIN Product p ON s.shop_id = p.shop_id
      LEFT JOIN OrderItem oi ON s.shop_id = oi.shop_id
      ${whereClause}
      GROUP BY s.shop_id
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM Shop s
      INNER JOIN Account a ON s.account_id = a.account_id
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        shops,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shops',
      error: error.message
    });
  }
};

// ==================== ORDERS MANAGEMENT ====================

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, customer_id, shop_id, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND o.status = ?';
      params.push(status);
    }
    if (customer_id) {
      whereClause += ' AND o.customer_id = ?';
      params.push(customer_id);
    }
    if (shop_id) {
      whereClause += ' AND oi.shop_id = ?';
      params.push(shop_id);
    }
    if (search) {
      whereClause += ' AND (o.order_id LIKE ? OR a.full_name LIKE ? OR a.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [orders] = await pool.query(`
      SELECT DISTINCT
        o.*,
        a.full_name as customer_name,
        a.email as customer_email,
        a.phone as customer_phone,
        sh.name as shipping_name,
        sh.fee as shipping_fee
      FROM \`Order\` o
      INNER JOIN Customer c ON o.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
      LEFT JOIN Shipping sh ON o.shipping_id = sh.shipping_id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Get order items count for each order
    for (let order of orders) {
      const [items] = await pool.query(`
        SELECT COUNT(*) as item_count, GROUP_CONCAT(DISTINCT s.shop_name) as shops
        FROM OrderItem oi
        INNER JOIN Shop s ON oi.shop_id = s.shop_id
        WHERE oi.order_id = ?
      `, [order.order_id]);
      order.item_count = items[0].item_count;
      order.shops = items[0].shops;
    }

    const [countResult] = await pool.query(`
      SELECT COUNT(DISTINCT o.order_id) as total 
      FROM \`Order\` o
      INNER JOIN Customer c ON o.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      LEFT JOIN OrderItem oi ON o.order_id = oi.order_id
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const [result] = await pool.query(
      'UPDATE `Order` SET status = ? WHERE order_id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// ==================== PRODUCTS MANAGEMENT ====================

// Get all products (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const { category_id, shop_id, status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (category_id) {
      whereClause += ' AND p.category_id = ?';
      params.push(category_id);
    }
    if (shop_id) {
      whereClause += ' AND p.shop_id = ?';
      params.push(shop_id);
    }
    if (status) {
      whereClause += ' AND p.status = ?';
      params.push(status);
    }
    if (search) {
      whereClause += ' AND (p.product_name LIKE ? OR s.shop_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [products] = await pool.query(`
      SELECT 
        p.*,
        s.shop_name,
        c.category_name,
        MIN(pi.price) as min_price,
        MAX(pi.price) as max_price,
        SUM(pi.stock) as total_stock,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM Product p
      INNER JOIN Shop s ON p.shop_id = s.shop_id
      INNER JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
      LEFT JOIN OrderItem oi ON pi.item_id = oi.variantID
      LEFT JOIN Review r ON p.product_id = r.target_id AND r.target_type = 'Product'
      ${whereClause}
      GROUP BY p.product_id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM Product p
      INNER JOIN Shop s ON p.shop_id = s.shop_id
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // Delete reviews
    await connection.query(
      'DELETE FROM Review WHERE target_type = "Product" AND target_id = ?',
      [id]
    );

    // Delete cart items containing this product
    await connection.query(`
      DELETE ci FROM CartItem ci
      INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
      WHERE pi.product_id = ?
    `, [id]);

    // Delete product items
    await connection.query('DELETE FROM ProductItem WHERE product_id = ?', [id]);

    // Delete product
    const [result] = await connection.query('DELETE FROM Product WHERE product_id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// ==================== REVIEWS MANAGEMENT ====================

// Get all reviews (Admin)
export const getAllReviews = async (req, res) => {
  try {
    const { target_type, rating, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (target_type) {
      whereClause += ' AND r.target_type = ?';
      params.push(target_type);
    }
    if (rating) {
      whereClause += ' AND r.rating = ?';
      params.push(rating);
    }
    if (search) {
      whereClause += ' AND (r.comment LIKE ? OR a.full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [reviews] = await pool.query(`
      SELECT 
        r.*,
        a.full_name as customer_name,
        a.email as customer_email,
        CASE 
          WHEN r.target_type = 'Product' THEN p.product_name
          WHEN r.target_type = 'Shop' THEN s.shop_name
        END as target_name
      FROM Review r
      INNER JOIN Customer c ON r.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      LEFT JOIN Product p ON r.target_type = 'Product' AND r.target_id = p.product_id
      LEFT JOIN Shop s ON r.target_type = 'Shop' AND r.target_id = s.shop_id
      ${whereClause}
      ORDER BY r.review_date DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM Review r
      INNER JOIN Customer c ON r.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      ${whereClause}
    `, params);

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
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

// Delete review (Admin)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Get review info for updating shop rating
    const [reviews] = await pool.query(
      'SELECT target_type, target_id FROM Review WHERE review_id = ?',
      [id]
    );

    const [result] = await pool.query(
      'DELETE FROM Review WHERE review_id = ?',
      [id]
    );

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

// ==================== DASHBOARD STATS ====================

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Total users by role
    const [userStats] = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Ban' THEN 1 ELSE 0 END) as banned
      FROM Account
      GROUP BY role
    `);

    // Order stats
    const [orderStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) as shipped,
        SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status != 'Cancelled' THEN total_amount ELSE 0 END) as total_revenue
      FROM \`Order\`
    `);

    // Product stats
    const [productStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN status = 'In stock' THEN 1 ELSE 0 END) as in_stock,
        SUM(CASE WHEN status = 'Out of stock' THEN 1 ELSE 0 END) as out_of_stock
      FROM Product
    `);

    // Recent orders
    const [recentOrders] = await pool.query(`
      SELECT 
        o.order_id,
        o.status,
        o.total_amount,
        o.created_at,
        a.full_name as customer_name
      FROM \`Order\` o
      INNER JOIN Customer c ON o.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    // Top shops by revenue
    const [topShops] = await pool.query(`
      SELECT 
        s.shop_id,
        s.shop_name,
        s.rating,
        fn_get_shop_revenue(s.shop_id) as total_revenue,
        COUNT(DISTINCT p.product_id) as product_count
      FROM Shop s
      LEFT JOIN Product p ON s.shop_id = p.shop_id
      GROUP BY s.shop_id
      ORDER BY total_revenue DESC
      LIMIT 5
    `);

    // Review stats
    const [reviewStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as avg_rating
      FROM Review
    `);

    res.json({
      success: true,
      data: {
        users: userStats,
        orders: orderStats[0],
        products: productStats[0],
        reviews: reviewStats[0],
        recent_orders: recentOrders,
        top_shops: topShops
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics',
      error: error.message
    });
  }
};
