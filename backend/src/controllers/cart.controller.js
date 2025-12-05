import { pool } from '../config/database.js';

// Get cart for current customer
export const getCart = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    // Get customer_id from account
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

    // Get cart
    const [carts] = await pool.query(
      'SELECT cart_id FROM Cart WHERE customer_id = ?',
      [customerId]
    );

    if (carts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartId = carts[0].cart_id;

    // Get cart items with product info grouped by shop
    const [cartItems] = await pool.query(`
      SELECT 
        ci.cart_item_id,
        ci.quantity,
        ci.added_at,
        pi.item_id,
        pi.color,
        pi.type,
        pi.price,
        pi.stock,
        pi.image_url as variant_image,
        p.product_id,
        p.product_name,
        p.image as product_image,
        p.status as product_status,
        s.shop_id,
        s.shop_name,
        s.shop_status
      FROM CartItem ci
      INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
      INNER JOIN Product p ON pi.product_id = p.product_id
      INNER JOIN Shop s ON p.shop_id = s.shop_id
      WHERE ci.cart_id = ?
      ORDER BY s.shop_id, ci.added_at DESC
    `, [cartId]);

    // Group items by shop
    const groupedByShop = cartItems.reduce((acc, item) => {
      const shopId = item.shop_id;
      if (!acc[shopId]) {
        acc[shopId] = {
          shop_id: shopId,
          shop_name: item.shop_name,
          shop_status: item.shop_status,
          items: []
        };
      }
      acc[shopId].items.push({
        cart_item_id: item.cart_item_id,
        item_id: item.item_id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        product_status: item.product_status,
        color: item.color,
        type: item.type,
        price: item.price,
        stock: item.stock,
        variant_image: item.variant_image,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        added_at: item.added_at
      });
      return acc;
    }, {});

    // Calculate totals
    const shops = Object.values(groupedByShop);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      success: true,
      data: {
        cart_id: cartId,
        shops,
        summary: {
          total_items: totalItems,
          total_amount: totalAmount,
          shop_count: shops.length
        }
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { item_id, quantity = 1 } = req.body;

    if (!item_id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    // Get customer_id from account
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

    // Get cart
    const [carts] = await pool.query(
      'SELECT cart_id FROM Cart WHERE customer_id = ?',
      [customerId]
    );

    if (carts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartId = carts[0].cart_id;

    // Check if product item exists and has stock
    const [items] = await pool.query(
      'SELECT item_id, stock, price FROM ProductItem WHERE item_id = ?',
      [item_id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product item not found'
      });
    }

    if (items[0].stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Check if item already in cart
    const [existingItems] = await pool.query(
      'SELECT cart_item_id, quantity FROM CartItem WHERE cart_id = ? AND item_id = ?',
      [cartId, item_id]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      
      if (newQuantity > items[0].stock) {
        return res.status(400).json({
          success: false,
          message: 'Total quantity exceeds available stock'
        });
      }

      await pool.query(
        'UPDATE CartItem SET quantity = ? WHERE cart_item_id = ?',
        [newQuantity, existingItems[0].cart_item_id]
      );

      res.json({
        success: true,
        message: 'Cart item quantity updated',
        data: { quantity: newQuantity }
      });
    } else {
      // Add new item
      const [result] = await pool.query(
        'INSERT INTO CartItem (cart_id, item_id, quantity) VALUES (?, ?, ?)',
        [cartId, item_id, quantity]
      );

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: { cart_item_id: result.insertId }
      });
    }

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { id } = req.params; // cart_item_id
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    // Get customer_id from account
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE customer_id = ?',
      [accountId]
    );

    const customerId = customers[0].customer_id;

    // Get cart
    const [carts] = await pool.query(
      'SELECT cart_id FROM Cart WHERE customer_id = ?',
      [customerId]
    );

    const cartId = carts[0].cart_id;

    // Check if cart item exists and belongs to this cart
    const [cartItems] = await pool.query(`
      SELECT ci.cart_item_id, ci.item_id, pi.stock
      FROM CartItem ci
      INNER JOIN ProductItem pi ON ci.item_id = pi.item_id
      WHERE ci.cart_item_id = ? AND ci.cart_id = ?
    `, [id, cartId]);

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity === 0) {
      // Remove item
      await pool.query('DELETE FROM CartItem WHERE cart_item_id = ?', [id]);
      return res.json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    if (quantity > cartItems[0].stock) {
      return res.status(400).json({
        success: false,
        message: 'Quantity exceeds available stock'
      });
    }

    // Update quantity
    await pool.query(
      'UPDATE CartItem SET quantity = ? WHERE cart_item_id = ?',
      [quantity, id]
    );

    res.json({
      success: true,
      message: 'Cart item updated'
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const accountId = req.user.account_id;
    const { id } = req.params; // cart_item_id

    // Get customer_id from account
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE customer_id = ?',
      [accountId]
    );

    const customerId = customers[0].customer_id;

    // Get cart
    const [carts] = await pool.query(
      'SELECT cart_id FROM Cart WHERE customer_id = ?',
      [customerId]
    );

    const cartId = carts[0].cart_id;

    // Delete cart item
    const [result] = await pool.query(
      'DELETE FROM CartItem WHERE cart_item_id = ? AND cart_id = ?',
      [id, cartId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const accountId = req.user.account_id;

    // Get customer_id from account
    const [customers] = await pool.query(
      'SELECT customer_id FROM Customer WHERE customer_id = ?',
      [accountId]
    );

    const customerId = customers[0].customer_id;

    // Get cart
    const [carts] = await pool.query(
      'SELECT cart_id FROM Cart WHERE customer_id = ?',
      [customerId]
    );

    const cartId = carts[0].cart_id;

    // Delete all cart items
    await pool.query('DELETE FROM CartItem WHERE cart_id = ?', [cartId]);

    res.json({
      success: true,
      message: 'Cart cleared'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};


