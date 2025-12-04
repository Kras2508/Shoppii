import { pool } from '../config/database.js';

// Get all shipping methods (public)
export const getShippingMethods = async (req, res) => {
  try {
    const { status } = req.query;

    let whereClause = '';
    const params = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const [shipping] = await pool.query(`
      SELECT * FROM Shipping ${whereClause} ORDER BY fee ASC
    `, params);

    res.json({
      success: true,
      data: shipping
    });

  } catch (error) {
    console.error('Get shipping methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shipping methods',
      error: error.message
    });
  }
};

// Get shipping method by ID
export const getShippingById = async (req, res) => {
  try {
    const { id } = req.params;

    const [shipping] = await pool.query(
      'SELECT * FROM Shipping WHERE shipping_id = ?',
      [id]
    );

    if (shipping.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipping method not found'
      });
    }

    res.json({
      success: true,
      data: shipping[0]
    });

  } catch (error) {
    console.error('Get shipping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shipping method',
      error: error.message
    });
  }
};

// Create shipping method (Admin only)
export const createShipping = async (req, res) => {
  try {
    const { name, estimated_days, fee, status = 'Active' } = req.body;

    if (!name || estimated_days === undefined || fee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, estimated days and fee are required'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO Shipping (name, estimated_days, fee, status)
      VALUES (?, ?, ?, ?)
    `, [name, estimated_days, fee, status]);

    res.status(201).json({
      success: true,
      message: 'Shipping method created successfully',
      data: { shipping_id: result.insertId }
    });

  } catch (error) {
    console.error('Create shipping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create shipping method',
      error: error.message
    });
  }
};

// Update shipping method (Admin only)
export const updateShipping = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, estimated_days, fee, status } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (estimated_days !== undefined) {
      updateFields.push('estimated_days = ?');
      updateValues.push(estimated_days);
    }
    if (fee !== undefined) {
      updateFields.push('fee = ?');
      updateValues.push(fee);
    }
    if (status) {
      if (!['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be Active or Inactive'
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
      `UPDATE Shipping SET ${updateFields.join(', ')} WHERE shipping_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipping method not found'
      });
    }

    res.json({
      success: true,
      message: 'Shipping method updated successfully'
    });

  } catch (error) {
    console.error('Update shipping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shipping method',
      error: error.message
    });
  }
};

// Delete shipping method (Admin only)
export const deleteShipping = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if shipping is used in orders
    const [orders] = await pool.query(
      'SELECT order_id FROM `Order` WHERE shipping_id = ? LIMIT 1',
      [id]
    );

    if (orders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete shipping method that is used in orders'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM Shipping WHERE shipping_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Shipping method not found'
      });
    }

    res.json({
      success: true,
      message: 'Shipping method deleted successfully'
    });

  } catch (error) {
    console.error('Delete shipping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete shipping method',
      error: error.message
    });
  }
};
