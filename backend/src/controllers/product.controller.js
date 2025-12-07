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

    // Call stored procedure sp_get_product_list
    await pool.query(
      'CALL sp_get_product_list(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @total_count)',
      [
        search || null,
        category_id || null,
        shop_id || null,
        min_price || null,
        max_price || null,
        status || null,
        sort_by,
        sort_order,
        parseInt(page),
        parseInt(limit)
      ]
    );

    // Get the result set (first result is the products)
    const [results] = await pool.query('SELECT @total_count as total_count');
    const totalCount = results[0].total_count;

    // Get products from the procedure result
    // Note: The procedure returns products as first result set
    const [[products]] = await pool.query(
      'CALL sp_get_product_list(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @total)',
      [
        search || null,
        category_id || null,
        shop_id || null,
        min_price || null,
        max_price || null,
        status || null,
        sort_by,
        sort_order,
        parseInt(page),
        parseInt(limit)
      ]
    );

    res.json({
      success: true,
      data: {
        products: products || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit)
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

    // Call stored procedure sp_add_product
    const image = variants && variants.length > 0 ? variants[0].image_url : null;
    await connection.query(
      'CALL sp_add_product(?, ?, ?, ?, ?, @product_id, @status)',
      [shopId, category_id, product_name, description || null, image]
    );

    // Get output parameters
    const [[result]] = await connection.query('SELECT @product_id as product_id, @status as status');
    
    if (result.product_id === -1) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: result.status
      });
    }

    const productId = result.product_id;

    // Insert variants if provided using sp_add_product_item
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await connection.query(
          'CALL sp_add_product_item(?, ?, ?, ?, ?, ?, ?, @item_id, @item_status)',
          [
            productId,
            shopId,
            variant.color || 'Default',
            variant.type || 'Standard',
            variant.price || 0,
            variant.stock || 0,
            variant.image_url || null
          ]
        );
        
        const [[itemResult]] = await connection.query('SELECT @item_id as item_id, @item_status as status');
        if (itemResult.item_id === -1) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: itemResult.status
          });
        }
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

    // Call stored procedure sp_update_product
    const image = variants && variants.length > 0 ? variants[0].image_url : null;
    await connection.query(
      'CALL sp_update_product(?, ?, ?, ?, ?, @success, @message)',
      [
        id,
        product_name || null,
        description !== undefined ? description : null,
        image,
        status || null
      ]
    );

    // Get output parameters
    const [[result]] = await connection.query('SELECT @success as success, @message as message');
    
    if (!result.success) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Update variants if provided
    if (variants && variants.length > 0) {
      // Delete old variants
      await connection.query('DELETE FROM ProductItem WHERE product_id = ?', [id]);
      
      // Insert new variants using sp_add_product_item
      for (const variant of variants) {
        if (variant.color && variant.type && variant.price !== undefined && variant.stock !== undefined) {
          await connection.query(
            'CALL sp_add_product_item(?, ?, ?, ?, ?, ?, ?, @item_id, @item_status)',
            [
              id,
              shopId,
              variant.color || 'Default',
              variant.type || 'Standard',
              variant.price,
              variant.stock,
              variant.image_url || null
            ]
          );
          
          const [[itemResult]] = await connection.query('SELECT @item_id as item_id, @item_status as status');
          if (itemResult.item_id === -1) {
            await connection.rollback();
            return res.status(400).json({
              success: false,
              message: itemResult.status
            });
          }
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: result.message
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

    // Call stored procedure sp_delete_product
    await connection.query(
      'CALL sp_delete_product(?, @success, @message)',
      [id]
    );

    // Get output parameters
    const [[result]] = await connection.query('SELECT @success as success, @message as message');
    
    if (!result.success) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message: result.message
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
      // Update existing variant using sp_update_product_item
      await pool.query(
        'CALL sp_update_product_item(?, ?, ?, ?, @success, @message)',
        [item_id, price, stock, image_url]
      );

      const [[result]] = await pool.query('SELECT @success as success, @message as message');
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }

      res.json({
        success: true,
        message: result.message
      });
    } else {
      // Create new variant using sp_add_product_item
      await pool.query(
        'CALL sp_add_product_item(?, ?, ?, ?, ?, ?, ?, @item_id, @status)',
        [id, shopId, color, type, price, stock, image_url]
      );

      const [[result]] = await pool.query('SELECT @item_id as item_id, @status as status');
      
      if (result.item_id === -1) {
        return res.status(400).json({
          success: false,
          message: result.status
        });
      }

      res.status(201).json({
        success: true,
        message: 'Variant created successfully',
        data: { item_id: result.item_id }
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

    // Call stored procedure sp_delete_product_item
    await pool.query(
      'CALL sp_delete_product_item(?, @success, @message)',
      [variantId]
    );

    const [[result]] = await pool.query('SELECT @success as success, @message as message');
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }

    res.json({
      success: true,
      message: result.message
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
        COALESCE((
          SELECT SUM(oi.quantity)
          FROM OrderItem oi
          INNER JOIN ProductItem pi2 ON oi.item_id = pi2.item_id
          INNER JOIN \`Order\` o ON oi.order_id = o.order_id
          WHERE pi2.product_id = p.product_id AND o.status != 'Cancelled'
        ), 0) as total_sold,
        COALESCE((
          SELECT AVG(r.rating)
          FROM Review r
          WHERE r.target_id = p.product_id AND r.target_type = 'Product'
        ), 0) as avg_rating,
        MAX(CASE WHEN pi.image_url IS NOT NULL THEN pi.image_url END) as image
      FROM Product p
      INNER JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN ProductItem pi ON p.product_id = pi.product_id
      ${whereClause}
      GROUP BY p.product_id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Fetch items for each product with sold quantity
    for (let product of products) {
      const [items] = await pool.query(`
        SELECT 
          pi.item_id,
          pi.color,
          pi.type,
          pi.price,
          pi.stock,
          pi.image_url,
          COALESCE((
            SELECT SUM(oi.quantity)
            FROM OrderItem oi
            INNER JOIN \`Order\` o ON oi.order_id = o.order_id
            WHERE oi.item_id = pi.item_id AND o.status != 'Cancelled'
          ), 0) as sold
        FROM ProductItem pi
        WHERE pi.product_id = ?
        ORDER BY pi.item_id
      `, [product.product_id]);
      
      product.items = items;
      product.item_count = items.length;
    }

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
