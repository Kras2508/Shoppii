import { pool } from '../config/database.js';

// Get orders for current user (Customer or Shop)
export const getOrders = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const role = req.user.role;
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = '';
    let countQuery = '';
    const params = [];

    if (role === 'Customer') {
      // Get customer_id
      const [customers] = await pool.query(
        'SELECT customer_id FROM Customer WHERE account_id = ?',
        [accountId]
      );

      if (customers.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      const customerId = customers[0].customer_id;
      params.push(customerId);

      let whereClause = 'WHERE o.customer_id = ?';
      if (status) {
        whereClause += ' AND o.status = ?';
        params.push(status);
      }

      query = `
        SELECT 
          o.*,
          sh.name as shipping_name,
          sh.fee as shipping_fee,
          v.discount_type,
          v.discount_value
        FROM \`Order\` o
        LEFT JOIN Shipping sh ON o.shipping_id = sh.shipping_id
        LEFT JOIN Voucher v ON o.voucher_id = v.voucher_id
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `;

      countQuery = `SELECT COUNT(*) as total FROM \`Order\` o ${whereClause}`;

    } else if (role === 'Shop') {
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
      params.push(shopId);

      let whereClause = 'WHERE oi.shop_id = ?';
      if (status) {
        whereClause += ' AND o.status = ?';
        params.push(status);
      }

      query = `
        SELECT DISTINCT
          o.*,
          a.full_name as customer_name,
          a.phone as customer_phone,
          sh.name as shipping_name,
          sh.fee as shipping_fee
        FROM \`Order\` o
        INNER JOIN OrderItem oi ON o.order_id = oi.order_id
        INNER JOIN Customer c ON o.customer_id = c.customer_id
        INNER JOIN Account a ON c.account_id = a.account_id
        LEFT JOIN Shipping sh ON o.shipping_id = sh.shipping_id
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `;

      countQuery = `
        SELECT COUNT(DISTINCT o.order_id) as total 
        FROM \`Order\` o
        INNER JOIN OrderItem oi ON o.order_id = oi.order_id
        ${whereClause}
      `;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, params.slice(0, -2));

    // Get order items for each order
    for (let order of orders) {
      let itemQuery = `
        SELECT 
          oi.*,
          pi.color,
          pi.type,
          pi.image_url as variant_image,
          p.product_id,
          p.product_name,
          p.image as product_image,
          s.shop_id,
          s.shop_name
        FROM OrderItem oi
        INNER JOIN ProductItem pi ON oi.variantID = pi.item_id
        INNER JOIN Product p ON pi.product_id = p.product_id
        INNER JOIN Shop s ON oi.shop_id = s.shop_id
        WHERE oi.order_id = ?
      `;

      // If shop, only show their items
      if (role === 'Shop') {
        const [shops] = await pool.query(
          'SELECT shop_id FROM Shop WHERE account_id = ?',
          [accountId]
        );
        itemQuery += ` AND oi.shop_id = ${shops[0].shop_id}`;
      }

      const [items] = await pool.query(itemQuery, [order.order_id]);
      order.items = items;
    }

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
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
};

// Get single order detail
export const getOrderById = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const role = req.user.role;
    const { id } = req.params;

    // Get order with calculated total using function
    const [orders] = await pool.query(`
      SELECT 
        o.*,
        fn_calculate_order_total(o.order_id) as calculated_total,
        a.full_name as customer_name,
        a.email as customer_email,
        a.phone as customer_phone,
        sh.name as shipping_name,
        sh.fee as shipping_fee,
        sh.estimated_days,
        v.discount_type,
        v.discount_value
      FROM \`Order\` o
      INNER JOIN Customer c ON o.customer_id = c.customer_id
      INNER JOIN Account a ON c.account_id = a.account_id
      LEFT JOIN Shipping sh ON o.shipping_id = sh.shipping_id
      LEFT JOIN Voucher v ON o.voucher_id = v.voucher_id
      WHERE o.order_id = ?
    `, [id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Check access permission
    if (role === 'Customer') {
      const [customers] = await pool.query(
        'SELECT customer_id FROM Customer WHERE account_id = ?',
        [accountId]
      );
      if (order.customer_id !== customers[0].customer_id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (role === 'Shop') {
      const [shops] = await pool.query(
        'SELECT shop_id FROM Shop WHERE account_id = ?',
        [accountId]
      );
      const [shopItems] = await pool.query(
        'SELECT order_item_id FROM OrderItem WHERE order_id = ? AND shop_id = ?',
        [id, shops[0].shop_id]
      );
      if (shopItems.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Get order items
    let itemQuery = `
      SELECT 
        oi.*,
        pi.color,
        pi.type,
        pi.image_url as variant_image,
        p.product_id,
        p.product_name,
        p.image as product_image,
        s.shop_id,
        s.shop_name
      FROM OrderItem oi
      INNER JOIN ProductItem pi ON oi.variantID = pi.item_id
      INNER JOIN Product p ON pi.product_id = p.product_id
      INNER JOIN Shop s ON oi.shop_id = s.shop_id
      WHERE oi.order_id = ?
    `;

    const [items] = await pool.query(itemQuery, [id]);
    order.items = items;

    // Group items by shop
    const groupedByShop = items.reduce((acc, item) => {
      if (!acc[item.shop_id]) {
        acc[item.shop_id] = {
          shop_id: item.shop_id,
          shop_name: item.shop_name,
          items: [],
          subtotal: 0
        };
      }
      acc[item.shop_id].items.push(item);
      acc[item.shop_id].subtotal += item.price_at_purchase * item.quantity;
      return acc;
    }, {});

    order.shops = Object.values(groupedByShop);

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

// Create order from cart (using stored procedure)
export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const accountId = req.user.account_id;
    const { shipping_id, voucher_id, shipping_address, payment_method } = req.body;

    // Validate required fields
    if (!shipping_id || !shipping_address || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Shipping method, address and payment method are required'
      });
    }

    // Get customer_id
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE account_id = ?',
      [accountId]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customerId = customers[0].customer_id;

    // Call stored procedure to create order
    await connection.query(
      'CALL sp_create_order_from_cart(?, ?, ?, ?, ?, @order_id)',
      [customerId, shipping_id, voucher_id || null, shipping_address, payment_method]
    );

    const [result] = await connection.query('SELECT @order_id as order_id');
    const orderId = result[0].order_id;

    // Get created order
    const [orders] = await pool.query(`
      SELECT o.*, sh.name as shipping_name, sh.fee as shipping_fee
      FROM \`Order\` o
      LEFT JOIN Shipping sh ON o.shipping_id = sh.shipping_id
      WHERE o.order_id = ?
    `, [orderId]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: orders[0]
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.sqlMessage || 'Failed to create order',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Update order status (Shop or Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const role = req.user.role;
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: Processing, Shipped, Delivered, Cancelled'
      });
    }

    // Check access permission
    if (role === 'Shop') {
      const [shops] = await pool.query(
        'SELECT shop_id FROM Shop WHERE account_id = ?',
        [accountId]
      );
      
      // Check if shop has items in this order
      const [shopItems] = await pool.query(
        'SELECT order_item_id FROM OrderItem WHERE order_id = ? AND shop_id = ?',
        [id, shops[0].shop_id]
      );

      if (shopItems.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Update order status
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

// Cancel order (Customer only - if Processing)
export const cancelOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const accountId = req.user.account_id;
    const { id } = req.params;

    // Get customer_id
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE account_id = ?',
      [accountId]
    );

    const customerId = customers[0].customer_id;

    // Get order
    const [orders] = await pool.query(
      'SELECT order_id, status, total_amount FROM `Order` WHERE order_id = ? AND customer_id = ?',
      [id, customerId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orders[0].status !== 'Processing') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel orders with Processing status'
      });
    }

    await connection.beginTransaction();

    // Restore stock for each item
    const [orderItems] = await pool.query(
      'SELECT variantID, quantity FROM OrderItem WHERE order_id = ?',
      [id]
    );

    for (const item of orderItems) {
      await connection.query(
        'UPDATE ProductItem SET stock = stock + ? WHERE item_id = ?',
        [item.quantity, item.variantID]
      );
    }

    // Update order status
    await connection.query(
      'UPDATE `Order` SET status = "Cancelled" WHERE order_id = ?',
      [id]
    );

    // Update customer stats
    await connection.query(
      'UPDATE Customer SET total_order = total_order - 1, total_spent = total_spent - ? WHERE customer_id = ?',
      [orders[0].total_amount, customerId]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  } finally {
    connection.release();
  }
};
