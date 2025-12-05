import { pool } from '../config/database.js';

// Get all products with filters
export const getProducts = async (req, res) => {
  try {
    const { 
      category_id, 
      shop_id, 
      search, 
      min_price, 
      max_price, 
      status,
      sort_by = 'created_at',
      sort_order = 'DESC',
      page = 1, 
      limit = 20 
    } = req.query;

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

    if (search) {
      whereClause += ' AND (p.product_name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND p.status = ?';
      params.push(status);
    }

    // Get products with aggregated info
    const query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.description,
        MAX(CASE WHEN pi.image_url IS NOT NULL THEN pi.image_url END) as image,
        p.status,
        p.created_at,
        p.shop_id,
        s.shop_name,
        s.rating as shop_rating,
        c.category_id,
        c.category_name,
        MIN(pi.price) as min_price,
        MAX(pi.price) as max_price,
        SUM(pi.stock) as total_stock,
        COUNT(DISTINCT pi.item_id) as variant_count,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM Product p
      INNER JOIN Shop s ON p.shop_id = s.shop_id
      INNER JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
      LEFT JOIN Review r ON p.product_id = r.target_id AND r.target_type = 'Product'
      ${whereClause}
      ${min_price ? 'HAVING min_price >= ?' : ''}
      ${max_price ? (min_price ? ' AND max_price <= ?' : 'HAVING max_price <= ?') : ''}
      GROUP BY p.product_id, p.product_name, p.description, p.image, p.status, 
               p.created_at, p.shop_id, s.shop_name, s.rating, c.category_id, c.category_name
      ORDER BY ${sort_by === 'price' ? 'min_price' : sort_by === 'rating' ? 'avg_rating' : 'p.created_at'} ${sort_order}
      LIMIT ? OFFSET ?
    `;

    if (min_price) params.push(min_price);
    if (max_price) params.push(max_price);
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(query, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT p.product_id) as total
      FROM Product p
      INNER JOIN Shop s ON p.shop_id = s.shop_id
      INNER JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
      ${whereClause}
    `;
    const [countResult] = await pool.query(countQuery, params.slice(0, -2));

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
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
};

// Get single product with variants
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product info
    const [products] = await pool.query(`
      SELECT 
        p.*,
        s.shop_name,
        s.rating as shop_rating,
        s.shop_status,
        c.category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.review_id) as review_count
      FROM Product p
      INNER JOIN Shop s ON p.shop_id = s.shop_id
      INNER JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN Review r ON p.product_id = r.target_id AND r.target_type = 'Product'
      WHERE p.product_id = ?
      GROUP BY p.product_id
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get product variants (ProductItem)
    const [variants] = await pool.query(`
      SELECT item_id, color, type, price, stock, image_url
      FROM ProductItem
      WHERE product_id = ?
    `, [id]);

    // Get reviews
    const [reviews] = await pool.query(`
      SELECT 
        r.*,
        a.full_name as customer_name
      FROM Review r
      INNER JOIN Customer c ON r.customer_id = c.customer_id
      INNER JOIN Account a ON c.customer_id = a.account_id
      WHERE r.target_type = 'Product' AND r.target_id = ?
      ORDER BY r.review_date DESC
      LIMIT 10
    `, [id]);

    res.json({
      success: true,
      data: {
        ...products[0],
        variants,
        reviews
      }
    });

  } catch (error) {
    console.error('Get product by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    });
  }
};

// Create new product (Shop only)
export const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const accountId = req.user.account_id;
    const { category_id, product_name, description, variants } = req.body;

    // Validate required fields
    if (!category_id || !product_name) {
      return res.status(400).json({
        success: false,
        message: 'Category and product name are required'
      });
    }

    // Get shop_id from account
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    await connection.beginTransaction();

    // Insert product (without image - store in variants instead)
    const [productResult] = await connection.query(`
      INSERT INTO Product (shop_id, category_id, product_name, description)
      VALUES (?, ?, ?, ?)
    `, [shopId, category_id, product_name, description || null]);

    const productId = productResult.insertId;

    // Insert variants if provided
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await connection.query(`
          INSERT INTO ProductItem (product_id, shop_id, color, type, price, stock, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          productId, 
          shopId, 
          variant.color || 'Default', 
          variant.type || 'Standard',
          variant.price || 0,
          variant.stock || 0,
          variant.image_url || null
        ]);
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product_id: productId }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Update product (Shop only)
export const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const accountId = req.user.account_id;
    const { id } = req.params;
    const { category_id, product_name, description, status, variants } = req.body;

    // Get shop_id from account
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Check if product belongs to this shop
    const [products] = await pool.query(
      'SELECT product_id FROM Product WHERE product_id = ? AND shop_id = ?',
      [id, shopId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not owned by this shop'
      });
    }

    await connection.beginTransaction();

    // Update Product basic info
    const updateFields = [];
    const updateValues = [];

    if (category_id) {
      updateFields.push('category_id = ?');
      updateValues.push(category_id);
    }
    if (product_name) {
      updateFields.push('product_name = ?');
      updateValues.push(product_name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await connection.query(
        `UPDATE Product SET ${updateFields.join(', ')} WHERE product_id = ?`,
        updateValues
      );
    }

    // Update variants if provided
    if (variants && variants.length > 0) {
      // Delete old variants
      await connection.query('DELETE FROM ProductItem WHERE product_id = ?', [id]);
      
      // Insert new variants
      for (const variant of variants) {
        if (variant.color && variant.type && variant.price !== undefined && variant.stock !== undefined) {
          await connection.query(`
            INSERT INTO ProductItem (product_id, shop_id, color, type, price, stock, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            id,
            shopId,
            variant.color || 'Default',
            variant.type || 'Standard',
            variant.price,
            variant.stock,
            variant.image_url || null
          ]);
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Product updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Delete product (Shop only)
export const deleteProduct = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const accountId = req.user.account_id;
    const { id } = req.params;

    // Get shop_id from account
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Check if product belongs to this shop
    const [products] = await pool.query(
      'SELECT product_id FROM Product WHERE product_id = ? AND shop_id = ?',
      [id, shopId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not owned by this shop'
      });
    }

    await connection.beginTransaction();

    // Delete product variants first (due to FK constraint)
    await connection.query('DELETE FROM ProductItem WHERE product_id = ?', [id]);

    // Delete reviews for this product
    await connection.query('DELETE FROM Review WHERE target_type = "Product" AND target_id = ?', [id]);

    // Delete product
    await connection.query('DELETE FROM Product WHERE product_id = ?', [id]);

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

// Add/Update product variant
export const upsertVariant = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { id } = req.params; // product_id
    const { item_id, color, type, price, stock, image_url } = req.body;

    // Get shop_id from account
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Check if product belongs to this shop
    const [products] = await pool.query(
      'SELECT product_id FROM Product WHERE product_id = ? AND shop_id = ?',
      [id, shopId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not owned by this shop'
      });
    }

    if (item_id) {
      // Update existing variant
      await pool.query(`
        UPDATE ProductItem 
        SET color = ?, type = ?, price = ?, stock = ?, image_url = ?
        WHERE item_id = ? AND product_id = ? AND shop_id = ?
      `, [color, type, price, stock, image_url, item_id, id, shopId]);

      res.json({
        success: true,
        message: 'Variant updated successfully'
      });
    } else {
      // Create new variant
      const [result] = await pool.query(`
        INSERT INTO ProductItem (product_id, shop_id, color, type, price, stock, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [id, shopId, color, type, price, stock, image_url]);

      res.status(201).json({
        success: true,
        message: 'Variant created successfully',
        data: { item_id: result.insertId }
      });
    }

  } catch (error) {
    console.error('Upsert variant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upsert variant',
      error: error.message
    });
  }
};

// Delete variant
export const deleteVariant = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { id, variantId } = req.params;

    // Get shop_id from account
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    // Delete variant
    const [result] = await pool.query(
      'DELETE FROM ProductItem WHERE item_id = ? AND product_id = ? AND shop_id = ?',
      [variantId, id, shopId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Variant not found'
      });
    }

    res.json({
      success: true,
      message: 'Variant deleted successfully'
    });

  } catch (error) {
    console.error('Delete variant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete variant',
      error: error.message
    });
  }
};

// Get products by shop (for shop dashboard)
export const getShopProducts = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    // Get shop_id from account
    const [shops] = await pool.query(
      'SELECT shop_id FROM Shop WHERE shop_id = ?',
      [accountId]
    );

    if (shops.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Shop not found'
      });
    }

    const shopId = shops[0].shop_id;

    let whereClause = 'WHERE p.shop_id = ?';
    const params = [shopId];

    if (status) {
      whereClause += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND p.product_name LIKE ?';
      params.push(`%${search}%`);
    }

    const [products] = await pool.query(`
      SELECT 
        p.*,
        c.category_name,
        MIN(pi.price) as min_price,
        MAX(pi.price) as max_price,
        SUM(pi.stock) as total_stock,
        COUNT(DISTINCT pi.item_id) as variant_count,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        MAX(CASE WHEN pi.image_url IS NOT NULL THEN pi.image_url END) as image
      FROM Product p
      INNER JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
      LEFT JOIN OrderItem oi ON pi.item_id = oi.item_id
      LEFT JOIN Review r ON p.product_id = r.target_id AND r.target_type = 'Product'
      ${whereClause}
      GROUP BY p.product_id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Get total count
    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM Product p ${whereClause}
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
    console.error('Get shop products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get shop products',
      error: error.message
    });
  }
};

// Get product statistics using stored procedure
export const getProductStatistics = async (req, res) => {
  try {
    const { category_id, shop_id, min_price, max_price } = req.query;

    // Call stored procedure sp_get_product_statistics
    const [results] = await pool.query(
      'CALL sp_get_product_statistics(?, ?, ?, ?)',
      [
        category_id || null,
        shop_id || null,
        min_price || null,
        max_price || null
      ]
    );

    res.json({
      success: true,
      data: {
        statistics: results[0] // First result set from procedure
      }
    });

  } catch (error) {
    console.error('Get product statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product statistics',
      error: error.message
    });
  }
};


