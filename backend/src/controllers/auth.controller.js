import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { JWT_SECRET } from '../middlewares/auth.middleware.js';

// Register new account
export const register = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { email, password, role, full_name, phone, address } = req.body;

    // Validate required fields
    if (!email || !password || !role || !full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: email, password, role, full_name, phone'
      });
    }

    // Validate role
    if (!['Customer', 'Shop'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be Customer or Shop'
      });
    }

    // Check if email already exists
    const [existingUser] = await pool.query(
      'SELECT account_id FROM Account WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // Insert into Account table
    // Trigger trg_account_after_insert will auto-create Customer/Shop/Admin record
    const [result] = await connection.query(
      `INSERT INTO Account (email, password, role, full_name, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, role, full_name, phone]
    );

    const accountId = result.insertId;

    // Update Customer address if role is Customer
    if (role === 'Customer' && address) {
      await connection.query(
        'UPDATE Customer SET address = ? WHERE customer_id = ?',
        [address, accountId]
      );
    }

    await connection.commit();

    // Generate JWT token
    const token = jwt.sign(
      { account_id: accountId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        account_id: accountId,
        email,
        role,
        full_name,
        token
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user by email
    const [users] = await pool.query(
      'SELECT * FROM Account WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check if account is banned
    if (user.status === 'Ban') {
      return res.status(403).json({
        success: false,
        message: 'Account has been banned'
      });
    }

    // Verify password (support both hashed and plain text for development)
    let isValidPassword = false;
    
    // Check if password is hashed (bcrypt hashes start with $2)
    if (user.password.startsWith('$2')) {
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // Plain text comparison (for seed data in development)
      isValidPassword = password === user.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get additional info based on role
    let additionalInfo = {};

    if (user.role === 'Customer') {
      const [customerData] = await pool.query(
        `SELECT 
          customer_id, address, add_phone, total_spent, total_order,
          fn_get_customer_total_spent(customer_id) as calculated_total_spent
         FROM Customer WHERE customer_id = ?`,
        [user.account_id]
      );
      if (customerData.length > 0) {
        additionalInfo = customerData[0];
      }
    } else if (user.role === 'Shop') {
      const [shopData] = await pool.query(
        `SELECT 
          shop_id, shop_name, shop_phone, address_shop, rating, shop_status,
          fn_get_shop_revenue(shop_id) as total_revenue,
          fn_calculate_shop_rating(shop_id) as calculated_rating
         FROM Shop WHERE shop_id = ?`,
        [user.account_id]
      );
      if (shopData.length > 0) {
        additionalInfo = shopData[0];
      }
    } else if (user.role === 'Admin') {
      const [adminData] = await pool.query(
        'SELECT admin_id, role as admin_role, note FROM Admin WHERE admin_id = ?',
        [user.account_id]
      );
      if (adminData.length > 0) {
        additionalInfo = adminData[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { account_id: user.account_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        account_id: user.account_id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone,
        status: user.status,
        created_at: user.created_at,
        ...additionalInfo,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    const [users] = await pool.query(
      'SELECT account_id, email, role, full_name, phone, status, created_at FROM Account WHERE account_id = ?',
      [accountId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    let additionalInfo = {};

    if (user.role === 'Customer') {
      const [customerData] = await pool.query(
        `SELECT 
          customer_id, address, add_phone, total_spent, total_order,
          fn_get_customer_total_spent(customer_id) as calculated_total_spent
         FROM Customer WHERE customer_id = ?`,
        [accountId]
      );
      if (customerData.length > 0) {
        additionalInfo = customerData[0];
      }
    } else if (user.role === 'Shop') {
      const [shopData] = await pool.query(
        `SELECT 
          shop_id, shop_name, shop_phone, address_shop, rating, shop_status,
          fn_get_shop_revenue(shop_id) as total_revenue,
          fn_calculate_shop_rating(shop_id) as calculated_rating
         FROM Shop WHERE shop_id = ?`,
        [accountId]
      );
      if (shopData.length > 0) {
        additionalInfo = shopData[0];
      }
    } else if (user.role === 'Admin') {
      const [adminData] = await pool.query(
        'SELECT admin_id, role as admin_role, note FROM Admin WHERE admin_id = ?',
        [accountId]
      );
      if (adminData.length > 0) {
        additionalInfo = adminData[0];
      }
    }

    res.json({
      success: true,
      data: {
        ...user,
        ...additionalInfo
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const accountId = req.user.account_id;
    const { full_name, phone, address, add_phone, shop_name, shop_phone, address_shop } = req.body;

    await connection.beginTransaction();

    // Update Account table
    if (full_name || phone) {
      const updateFields = [];
      const updateValues = [];

      if (full_name) {
        updateFields.push('full_name = ?');
        updateValues.push(full_name);
      }
      if (phone) {
        updateFields.push('phone = ?');
        updateValues.push(phone);
      }

      updateValues.push(accountId);

      await connection.query(
        `UPDATE Account SET ${updateFields.join(', ')} WHERE account_id = ?`,
        updateValues
      );
    }

    // Update role-specific table
    if (req.user.role === 'Customer') {
      const customerFields = [];
      const customerValues = [];

      if (address !== undefined) {
        customerFields.push('address = ?');
        customerValues.push(address);
      }
      if (add_phone !== undefined) {
        customerFields.push('add_phone = ?');
        customerValues.push(add_phone);
      }

      if (customerFields.length > 0) {
        customerValues.push(accountId);
        await connection.query(
          `UPDATE Customer SET ${customerFields.join(', ')} WHERE customer_id = ?`,
          customerValues
        );
      }
    } else if (req.user.role === 'Shop') {
      const shopFields = [];
      const shopValues = [];

      if (shop_name) {
        shopFields.push('shop_name = ?');
        shopValues.push(shop_name);
      }
      if (shop_phone !== undefined) {
        shopFields.push('shop_phone = ?');
        shopValues.push(shop_phone);
      }
      if (address_shop !== undefined) {
        shopFields.push('address_shop = ?');
        shopValues.push(address_shop);
      }

      if (shopFields.length > 0) {
        shopValues.push(accountId);
        await connection.query(
          `UPDATE Shop SET ${shopFields.join(', ')} WHERE shop_id = ?`,
          shopValues
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get current password
    const [users] = await pool.query(
      'SELECT password FROM Account WHERE account_id = ?',
      [accountId]
    );

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, users[0].password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE Account SET password = ? WHERE account_id = ?',
      [hashedPassword, accountId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

