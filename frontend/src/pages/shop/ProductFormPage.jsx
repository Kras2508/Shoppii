import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { productService } from '../../api/productService';
import createPrivateClient from '../../clients/private.client';

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);
  const isEditing = Boolean(productId);

  const [loading, setLoading] = useState(isEditing);
  const [dragActive, setDragActive] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    category_id: '',
    price: '',
    oldPrice: '',
    stock: '',
    status: 'Active',
    images: [],
    colors: [''],
    sizes: ['']
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categoryService } = await import('../../api/categoryService');
        const response = await categoryService.getCategories();
        if (response.data?.data) {
          // Backend returns either flat or categories tree
          const catList = response.data.data.flat || response.data.data.categories || response.data.data;
          const flatCategories = Array.isArray(catList) ? catList : [];
          setCategories(flatCategories.map(cat => ({
            id: cat.category_id,
            name: cat.category_name
          })));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (isEditing && productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await productService.getProductById(productId);
          if (response.data?.data) {
            const product = response.data.data;
            
            // Parse variants from backend
            const variants = product.variants || [];
            const colors = [...new Set(variants.map(v => v.color))].filter(c => c);
            const sizes = [...new Set(variants.map(v => v.type))].filter(s => s);
            const images = variants.map(v => v.image_url).filter(img => img);
            
            // Get price and stock from first variant
            const firstVariant = variants[0];
            
            setFormData({
              product_name: product.product_name || '',
              description: product.description || '',
              category_id: product.category_id?.toString() || '',
              price: (firstVariant?.price || 0).toString(),
              oldPrice: (product.old_price || 0).toString(),
              stock: (firstVariant?.stock || 0).toString(),
              status: product.status || 'Active',
              images: images.length > 0 ? images : [],
              colors: colors.length > 0 ? colors : [''],
              sizes: sizes.length > 0 ? sizes : ['']
            });
          }
        } catch (err) {
          console.error('Error fetching product:', err);
          alert('Cannot load product data.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [isEditing, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await privateClient.post('/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data?.success && response.data?.data?.url) {
          // Build full image URL
          const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
          const fullImageUrl = baseURL.replace('/api', '') + response.data.data.url;
          
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, fullImageUrl].slice(0, 8)
          }));
        }
      } catch (error) {
        console.error('Image upload error:', error);
        alert('Failed to upload image: ' + error.message);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    
    files.forEach(file => {
      const formData = new FormData();
      formData.append('image', file);
      
      privateClient.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then(response => {
          if (response.data?.success && response.data?.data?.url) {
            // Build full image URL
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
            const fullImageUrl = baseURL.replace('/api', '') + response.data.data.url;
            
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, fullImageUrl].slice(0, 8)
            }));
          }
        })
        .catch(error => {
          console.error('Image upload error:', error);
          alert('Failed to upload image: ' + error.message);
        });
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (type, index, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? value : item)
    }));
  };

  const addVariant = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const removeVariant = (type, index) => {
    if (formData[type].length > 1) {
      setFormData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name.trim()) newErrors.product_name = 'Please enter product name';
    if (!formData.category_id) newErrors.category_id = 'Please select a category';
    if (!formData.price || parseInt(formData.price) <= 0) newErrors.price = 'Please enter a valid price';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Please enter stock quantity';
    if (formData.images.length === 0) newErrors.images = 'Please add at least one image';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const productData = {
        category_id: parseInt(formData.category_id),
        product_name: formData.product_name,
        description: formData.description,
        variants: formData.colors.filter(c => c.trim()).map((color, idx) => ({
          color,
          type: formData.sizes[idx] || 'Standard',
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          image_url: formData.images[idx] || null
        }))
      };

      if (isEditing) {
        // Update existing product
        await productService.updateProduct(productId, productData, privateClient);
        alert('Product updated successfully!');
      } else {
        // Create new product
        await productService.createProduct(productData, privateClient);
        alert('Product created successfully!');
      }
      navigate('/shop/products');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  if (loading) {
    return (
      <div style={shopStyles.page}>
        <div style={shopStyles.container}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shopStyles.page}>
      <div style={shopStyles.container}>
        {/* Header */}
        <div style={shopStyles.pageHeader}>
          <div>
            <h1 style={shopStyles.pageTitle}>
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <Link to="/shop/products" style={{ color: '#666', fontSize: '14px' }}>
              ← Back to product list
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={shopStyles.formGrid}>
            {/* Left Column - Main Info */}
            <div>
              {/* Basic Info */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>📝 Basic Information</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Product Name <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    style={{
                      ...shopStyles.formInput,
                      borderColor: errors.product_name ? '#dc3545' : '#ddd'
                    }}
                    value={formData.product_name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                  />
                  {errors.product_name && <div style={shopStyles.formError}>{errors.product_name}</div>}
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Category <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <select
                    name="category_id"
                    style={{
                      ...shopStyles.formSelect,
                      borderColor: errors.category_id ? '#dc3545' : '#ddd'
                    }}
                    value={formData.category_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select category --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <div style={shopStyles.formError}>{errors.category_id}</div>}
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Product Description</label>
                  <textarea
                    name="description"
                    style={shopStyles.formTextarea}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detail description about product..."
                  />
                </div>
              </div>

              {/* Images - Upload */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>
                  🖼️ Product Images <span style={{ color: '#dc3545' }}>*</span>
                </h3>
                
                <div
                  style={{
                    border: '2px dashed #ddd',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: dragActive ? '#f0f7f1' : 'white',
                    borderColor: errors.images ? '#dc3545' : (dragActive ? '#647A67' : '#ddd'),
                    transition: 'all 0.2s'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-input').click()}
                >
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
                  <p style={{ color: '#333', marginBottom: '4px', fontWeight: '500' }}>
                    Drag and drop images here or click to select
                  </p>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    JPG, PNG or WebP. Max 5MB per file. Up to 8 images.
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    {formData.images.map((url, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f0f0f0',
                          aspectRatio: '1',
                          border: index === 0 ? '2px solid #647A67' : '1px solid #ddd'
                        }}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(220, 53, 69, 0.9)',
                            color: 'white',
                            border: 'none',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </button>
                        {index === 0 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            left: '4px',
                            backgroundColor: '#647A67',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}>
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && <div style={shopStyles.formError}>{errors.images}</div>}
              </div>

              {/* Variants */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>🎨 Variants</h3>
                
                {/* Colors */}
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Colors</label>
                  <div style={shopStyles.variantSection}>
                    {formData.colors.map((color, index) => (
                      <div key={index} style={shopStyles.variantRow}>
                        <input
                          type="text"
                          style={shopStyles.variantInput}
                          value={color}
                          onChange={(e) => handleVariantChange('colors', index, e.target.value)}
                          placeholder="e.g., White, Black, Blue..."
                        />
                        <button
                          type="button"
                          style={shopStyles.iconBtn}
                          onClick={() => removeVariant('colors', index)}
                          disabled={formData.colors.length <= 1}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      style={shopStyles.addVariantBtn}
                      onClick={() => addVariant('colors')}
                    >
                      More Colors
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Sizes</label>
                  <div style={shopStyles.variantSection}>
                    {formData.sizes.map((size, index) => (
                      <div key={index} style={shopStyles.variantRow}>
                        <input
                          type="text"
                          style={shopStyles.variantInput}
                          value={size}
                          onChange={(e) => handleVariantChange('sizes', index, e.target.value)}
                          placeholder="VD: S, M, L, XL..."
                        />
                        <button
                          type="button"
                          style={shopStyles.iconBtn}
                          onClick={() => removeVariant('sizes', index)}
                          disabled={formData.sizes.length <= 1}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      style={shopStyles.addVariantBtn}
                      onClick={() => addVariant('sizes')}
                    >
                      More Sizes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price & Status */}
            <div>
              {/* Pricing */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>💰 Price</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Price <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    style={{
                      ...shopStyles.formInput,
                      borderColor: errors.price ? '#dc3545' : '#ddd'
                    }}
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                  {errors.price && <div style={shopStyles.formError}>{errors.price}</div>}
                  <div style={shopStyles.formHelper}>Unit: VND</div>
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Original Price (before discount)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    style={shopStyles.formInput}
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                  <div style={shopStyles.formHelper}>Leave blank if no discount</div>
                </div>

                {formData.oldPrice && parseInt(formData.oldPrice) > parseInt(formData.price || 0) && (
                  <div style={{
                    backgroundColor: '#d4edda',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#155724'
                  }}>
                    🏷️ Discount: {Math.round((1 - parseInt(formData.price || 0) / parseInt(formData.oldPrice)) * 100)}%
                  </div>
                )}
              </div>

              {/* Stock */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>📦 Kho hàng</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Stock <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    style={{
                      ...shopStyles.formInput,
                      borderColor: errors.stock ? '#dc3545' : '#ddd'
                    }}
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                  {errors.stock && <div style={shopStyles.formError}>{errors.stock}</div>}
                </div>
              </div>

              {/* Status */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>Status</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Product Status</label>
                  <select
                    name="status"
                    style={shopStyles.formSelect}
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div style={shopStyles.card}>
                <button
                  type="submit"
                  style={{ ...shopStyles.primaryBtn, width: '100%', justifyContent: 'center' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
                >
                  {isEditing ? 'Update Product' : 'Create Product'}
                </button>
                
                <button
                  type="button"
                  style={{ ...shopStyles.secondaryBtn, width: '100%', justifyContent: 'center', marginTop: '12px' }}
                  onClick={() => navigate('/shop/products')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
