import { pool } from '../config/database.js';

// Get all vouchers (public - only active)
export const getVouchers = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    // Public: only show active and not expired
    if (!status) {
      whereClause += ' AND status = "Active" AND expired_date > CURDATE()';
    } else {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const [vouchers] = await pool.query(`
      SELECT 
        voucher_id,
        discount_type,
        discount_value,
        min_order_value,
        expired_date,
        usage_limit,
        used_count,
        status,
        (usage_limit - used_count) as remaining
      FROM Voucher
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM Voucher ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        vouchers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get vouchers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vouchers',
      error: error.message
    });
  }
};

// Get voucher by ID
export const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;

    const [vouchers] = await pool.query(
      'SELECT * FROM Voucher WHERE voucher_id = ?',
      [id]
    );

    if (vouchers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    res.json({
      success: true,
      data: vouchers[0]
    });

  } catch (error) {
    console.error('Get voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voucher',
      error: error.message
    });
  }
};

// Apply voucher (using stored procedure)
export const applyVoucher = async (req, res) => {
  try {
    const { voucher_id, order_amount } = req.body;

    if (!voucher_id || !order_amount) {
      return res.status(400).json({
        success: false,
        message: 'Voucher ID and order amount are required'
      });
    }

    // Call stored procedure
    await pool.query(
      'CALL sp_apply_voucher(?, ?, @discount, @valid, @message)',
      [voucher_id, order_amount]
    );

    const [result] = await pool.query(
      'SELECT @discount as discount_amount, @valid as is_valid, @message as message'
    );

    const { discount_amount, is_valid, message } = result[0];

    if (!is_valid) {
      return res.status(400).json({
        success: false,
        message: message
      });
    }

    res.json({
      success: true,
      message: message,
      data: {
        discount_amount: parseFloat(discount_amount),
        final_amount: order_amount - parseFloat(discount_amount)
      }
    });

  } catch (error) {
    console.error('Apply voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply voucher',
      error: error.message
    });
  }
};

// Create voucher (Admin only)
export const createVoucher = async (req, res) => {
  try {
    const { 
      discount_type, 
      discount_value, 
      min_order_value = 0, 
      expired_date, 
      usage_limit = 1 
    } = req.body;

    if (!discount_type || !discount_value || !expired_date) {
      return res.status(400).json({
        success: false,
        message: 'Discount type, value and expiry date are required'
      });
    }

    if (!['Percentage', 'Amount'].includes(discount_type)) {
      return res.status(400).json({
        success: false,
        message: 'Discount type must be Percentage or Amount'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO Voucher (discount_type, discount_value, min_order_value, expired_date, usage_limit)
      VALUES (?, ?, ?, ?, ?)
    `, [discount_type, discount_value, min_order_value, expired_date, usage_limit]);

    res.status(201).json({
      success: true,
      message: 'Voucher created successfully',
      data: { voucher_id: result.insertId }
    });

  } catch (error) {
    console.error('Create voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create voucher',
      error: error.message
    });
  }
};

// Update voucher (Admin only)
export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount_type, discount_value, min_order_value, expired_date, usage_limit, status } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (discount_type) {
      if (!['Percentage', 'Amount'].includes(discount_type)) {
        return res.status(400).json({
          success: false,
          message: 'Discount type must be Percentage or Amount'
        });
      }
      updateFields.push('discount_type = ?');
      updateValues.push(discount_type);
    }
    if (discount_value !== undefined) {
      updateFields.push('discount_value = ?');
      updateValues.push(discount_value);
    }
    if (min_order_value !== undefined) {
      updateFields.push('min_order_value = ?');
      updateValues.push(min_order_value);
    }
    if (expired_date) {
      updateFields.push('expired_date = ?');
      updateValues.push(expired_date);
    }
    if (usage_limit !== undefined) {
      updateFields.push('usage_limit = ?');
      updateValues.push(usage_limit);
    }
    if (status) {
      if (!['Active', 'Expired'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be Active or Expired'
        });
      }
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    const [result] = await pool.query(
      `UPDATE Voucher SET ${updateFields.join(', ')} WHERE voucher_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    res.json({
      success: true,
      message: 'Voucher updated successfully'
    });

  } catch (error) {
    console.error('Update voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update voucher',
      error: error.message
    });
  }
};

// Delete voucher (Admin only)
export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if voucher is used in orders
    const [orders] = await pool.query(
      'SELECT order_id FROM `Order` WHERE voucher_id = ? LIMIT 1',
      [id]
    );

    if (orders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete voucher that is used in orders'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM Voucher WHERE voucher_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    res.json({
      success: true,
      message: 'Voucher deleted successfully'
    });

  } catch (error) {
    console.error('Delete voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete voucher',
      error: error.message
    });
  }
};
