import { pool } from '../config/database.js';

// Get shop profile (public)
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const [shops] = await pool.query(`
      SELECT 
        s.*,
        a.email,
        a.full_name as owner_name,
        a.phone,
        a.status as account_status,
        a.created_at,
        COUNT(DISTINCT p.product_id) as total_products,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COUNT(DISTINCT r.review_id) as total_reviews
      FROM Shop s
      INNER JOIN Account a ON s.account_id = a.account_id
      LEFT JOIN Product p ON s.shop_id = p.shop_id
      LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
      LEFT JOIN OrderItem oi ON pi.item_id = oi.variantID
      LEFT JOIN Review r ON s.shop_id = r.target_id AND r.target_type = 'Shop'
      WHERE s.shop_id = ?
      GROUP BY s.shop_id
    `, [id]);

    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      data: shops[0]
    });

  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shop',
      error: error.message
    });
  }
};

// Get all shops (public)
export const getShops = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE a.status = "Active"';
    const params = [];

    if (search) {
      whereClause += ' AND (s.shop_name LIKE ? OR a.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND s.shop_status = ?';
      params.push(status);
    }

    const [shops] = await pool.query(`
      SELECT 
        s.*,
        a.email,
        a.created_at,
        COUNT(DISTINCT p.product_id) as total_products
      FROM Shop s
      INNER JOIN Account a ON s.account_id = a.account_id
      LEFT JOIN Product p ON s.shop_id = p.shop_id
      ${whereClause}
      GROUP BY s.shop_id
      ORDER BY s.rating DESC, s.shop_id DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(DISTINCT s.shop_id) as total
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
    console.error('Get shops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shops',
      error: error.message
    });
  }
};

// Get shop dashboard data (Shop only)
export const getShopDashboard = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    // Get shop_id
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE account_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Get shop info with stats
    const [shopInfo] = await pool.query(`
      SELECT 
        s.*,
        a.email,
        a.full_name,
        a.phone,
        a.created_at
      FROM Shop s
      INNER JOIN Account a ON s.account_id = a.account_id
      WHERE s.shop_id = ?
    `, [shopId]);

    // Get product stats
    const [productStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN status = 'In stock' THEN 1 ELSE 0 END) as in_stock,
        SUM(CASE WHEN status = 'Out of stock' THEN 1 ELSE 0 END) as out_of_stock
      FROM Product WHERE shop_id = ?
    `, [shopId]);

    // Get order stats
    const [orderStats] = await pool.query(`
      SELECT 
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(CASE WHEN o.status = 'Processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN o.status = 'Shipped' THEN 1 ELSE 0 END) as shipped,
        SUM(CASE WHEN o.status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN o.status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
      FROM \`Order\` o
      INNER JOIN OrderItem oi ON o.order_id = oi.order_id
      WHERE oi.shop_id = ?
    `, [shopId]);

    // Get revenue using function
    const [revenue] = await pool.query(
      'SELECT fn_get_shop_revenue(?) as total_revenue',
      [shopId]
    );

    // Get recent orders
    const [recentOrders] = await pool.query(`
      SELECT DISTINCT
        o.order_id,
        o.status,
        o.total_amount,
        o.created_at,
        a.full_name as customer_name
      FROM \`Order\` o
      INNER JOIN OrderItem oi ON o.order_id = oi.order_id
      INNER JOIN Customer c ON o.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      WHERE oi.shop_id = ?
      ORDER BY o.created_at DESC
      LIMIT 5
    `, [shopId]);

    // Get top products
    const [topProducts] = await pool.query(`
      SELECT 
        p.product_id,
        p.product_name,
        p.image,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as total_revenue
      FROM Product p
      INNER JOIN ProductItem pi ON p.product_id = pi.product_id
      INNER JOIN OrderItem oi ON pi.item_id = oi.variantID
      INNER JOIN \`Order\` o ON oi.order_id = o.order_id
      WHERE p.shop_id = ? AND o.status != 'Cancelled'
      GROUP BY p.product_id
      ORDER BY total_sold DESC
      LIMIT 5
    `, [shopId]);

    res.json({
      success: true,
      data: {
        shop: shopInfo[0],
        stats: {
          products: productStats[0],
          orders: orderStats[0],
          total_revenue: revenue[0].total_revenue
        },
        recent_orders: recentOrders,
        top_products: topProducts
      }
    });

  } catch (error) {
    console.error('Get shop dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
};

// Update shop profile (Shop only)
export const updateShopProfile = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { shop_name, shop_phone, address_shop, shop_status } = req.body;

    // Get shop_id
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE account_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (shop_name) {
      updateFields.push('shop_name = ?');
      updateValues.push(shop_name);
    }
    if (shop_phone !== undefined) {
      updateFields.push('shop_phone = ?');
      updateValues.push(shop_phone);
    }
    if (address_shop !== undefined) {
      updateFields.push('address_shop = ?');
      updateValues.push(address_shop);
    }
    if (shop_status) {
      if (!['Open', 'Temporarily Close', 'Closed'].includes(shop_status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid shop status'
        });
      }
      updateFields.push('shop_status = ?');
      updateValues.push(shop_status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(shopId);

    await pool.query(
      `UPDATE Shop SET ${updateFields.join(', ')} WHERE shop_id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Shop profile updated successfully'
    });

  } catch (error) {
    console.error('Update shop profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shop profile',
      error: error.message
    });
  }
};

// Get shop revenue report (using stored procedure)
export const getShopRevenueReport = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { from_date, to_date } = req.query;

    // Get shop_id
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE account_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Default dates: last 30 days
    const fromDate = from_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const toDate = to_date || new Date().toISOString().split('T')[0];

    // Call stored procedure
    const [results] = await pool.query(
      'CALL sp_get_shop_revenue_report(?, ?, ?)',
      [shopId, fromDate, toDate]
    );

    res.json({
      success: true,
      data: {
        summary: results[0][0],
        top_products: results[1]
      }
    });

  } catch (error) {
    console.error('Get shop revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue report',
      error: error.message
    });
  }
};
