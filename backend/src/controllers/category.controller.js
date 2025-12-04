import { pool } from '../config/database.js';

// Get all categories (public)
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT 
        c.*,
        pc.category_name as parent_name,
        COUNT(p.product_id) as product_count
      FROM Category c
      LEFT JOIN Category pc ON c.parent_category_id = pc.category_id
      LEFT JOIN Product p ON c.category_id = p.category_id
      GROUP BY c.category_id
      ORDER BY c.parent_category_id IS NULL DESC, c.category_name
    `);

    // Build tree structure
    const categoryMap = {};
    const rootCategories = [];

    categories.forEach(cat => {
      categoryMap[cat.category_id] = {
        ...cat,
        children: []
      };
    });

    categories.forEach(cat => {
      if (cat.parent_category_id) {
        if (categoryMap[cat.parent_category_id]) {
          categoryMap[cat.parent_category_id].children.push(categoryMap[cat.category_id]);
        }
      } else {
        rootCategories.push(categoryMap[cat.category_id]);
      }
    });

    res.json({
      success: true,
      data: {
        categories: rootCategories,
        flat: categories
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await pool.query(`
      SELECT 
        c.*,
        pc.category_name as parent_name
      FROM Category c
      LEFT JOIN Category pc ON c.parent_category_id = pc.category_id
      WHERE c.category_id = ?
    `, [id]);

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get subcategories
    const [subcategories] = await pool.query(
      'SELECT * FROM Category WHERE parent_category_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...categories[0],
        subcategories
      }
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category',
      error: error.message
    });
  }
};

// Create category (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { category_name, parent_category_id } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check parent exists if provided
    if (parent_category_id) {
      const [parent] = await pool.query(
        'SELECT category_id FROM Category WHERE category_id = ?',
        [parent_category_id]
      );
      if (parent.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO Category (category_name, parent_category_id) VALUES (?, ?)',
      [category_name, parent_category_id || null]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category_id: result.insertId }
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, parent_category_id } = req.body;

    // Check category exists
    const [existing] = await pool.query(
      'SELECT category_id FROM Category WHERE category_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (category_name) {
      updateFields.push('category_name = ?');
      updateValues.push(category_name);
    }
    if (parent_category_id !== undefined) {
      // Prevent setting itself as parent
      if (parent_category_id == id) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be its own parent'
        });
      }
      updateFields.push('parent_category_id = ?');
      updateValues.push(parent_category_id || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE Category SET ${updateFields.join(', ')} WHERE category_id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const [products] = await pool.query(
      'SELECT product_id FROM Product WHERE category_id = ? LIMIT 1',
      [id]
    );

    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with products'
      });
    }

    // Check if category has subcategories
    const [subcategories] = await pool.query(
      'SELECT category_id FROM Category WHERE parent_category_id = ? LIMIT 1',
      [id]
    );

    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM Category WHERE category_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};
