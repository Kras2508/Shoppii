import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shoppii_secret_key_2024';

// Verify JWT Token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const [rows] = await pool.query(
      'SELECT account_id, email, role, full_name, phone, status FROM Account WHERE account_id = ?',
      [decoded.account_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    if (rows[0].status === 'Ban') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account has been banned.' 
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Check if user is Customer
export const isCustomer = (req, res, next) => {
  if (req.user.role !== 'Customer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Customer only.' 
    });
  }
  next();
};

// Check if user is Shop
export const isShop = (req, res, next) => {
  if (req.user.role !== 'Shop') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Shop only.' 
    });
  }
  next();
};

// Check if user is Admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
  next();
};

// Check if user is Shop or Admin
export const isShopOrAdmin = (req, res, next) => {
  if (req.user.role !== 'Shop' && req.user.role !== 'Admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Shop or Admin only.' 
    });
  }
  next();
};

export { JWT_SECRET };
