import { pool } from '../config/database.js';

// Get customer statistics using Part 2 functions
export const getCustomerStatistics = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    // Get customer_id
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE customer_id = ?',
      [accountId]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customerId = customers[0].customer_id;

    // Use fn_get_customer_total_spent from Part 2
    const [totalSpentResult] = await pool.query(
      'SELECT fn_get_customer_total_spent(?) as total_spent',
      [customerId]
    );

    // Get order counts by status
    const [orderStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) as processing_count,
        SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) as shipped_count,
        SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered_count,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_count
      FROM \`Order\`
      WHERE customer_id = ?
    `, [customerId]);

    // Calculate average order value from all non-cancelled orders using fn_calculate_order_total
    const [avgOrderResult] = await pool.query(`
      SELECT AVG(fn_calculate_order_total(order_id)) as avg_order_value
      FROM \`Order\`
      WHERE customer_id = ? AND status != 'Cancelled'
    `, [customerId]);

    // Get total items purchased from all non-cancelled orders
    const [itemsResult] = await pool.query(`
      SELECT COALESCE(SUM(oi.quantity), 0) as total_items
      FROM OrderItem oi
      INNER JOIN \`Order\` o ON oi.order_id = o.order_id
      WHERE o.customer_id = ? AND o.status != 'Cancelled'
    `, [customerId]);

    // Get total reviews count
    const [reviewsResult] = await pool.query(`
      SELECT COUNT(*) as review_count
      FROM Review
      WHERE customer_id = ?
    `, [customerId]);

    // Get monthly spending (last 6 months) using fn_calculate_order_total
    const [monthlySpending] = await pool.query(`
      SELECT 
        DATE_FORMAT(o.created_at, '%Y-%m') as month,
        SUM(fn_calculate_order_total(o.order_id)) as amount
      FROM \`Order\` o
      WHERE o.customer_id = ? 
        AND o.status != 'Cancelled'
        AND o.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
      ORDER BY month ASC
    `, [customerId]);

    res.json({
      success: true,
      data: {
        total_spent: parseFloat(totalSpentResult[0].total_spent) || 0,
        total_orders: orderStats[0].total_orders || 0,
        processing_count: orderStats[0].processing_count || 0,
        shipped_count: orderStats[0].shipped_count || 0,
        delivered_count: orderStats[0].delivered_count || 0,
        cancelled_count: orderStats[0].cancelled_count || 0,
        avg_order_value: parseFloat(avgOrderResult[0].avg_order_value) || 0,
        total_items_purchased: itemsResult[0].total_items || 0,
        review_count: reviewsResult[0].review_count || 0,
        monthly_spending: monthlySpending.map(m => ({
          month: m.month,
          amount: parseFloat(m.amount) || 0
        }))
      }
    });

  } catch (error) {
    console.error('Get customer statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer statistics',
      error: error.message
    });
  }
};

// Get customer profile with total_spent from function
export const getCustomerProfile = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    const [customers] = await pool.query(`
      SELECT 
        a.*,
        c.address,
        c.add_phone,
        c.total_order,
        fn_get_customer_total_spent(c.customer_id) as total_spent
      FROM Account a
      INNER JOIN Customer c ON a.account_id = c.customer_id
      WHERE a.account_id = ?
    `, [accountId]);

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Remove password from response
    const { password, ...customerData } = customers[0];

    res.json({
      success: true,
      data: customerData
    });

  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customer profile',
      error: error.message
    });
  }
};
