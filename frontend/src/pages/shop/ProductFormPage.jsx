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

  // Form state - theo đúng database schema
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    category_id: '',
    image: '', // Product main image
    status: 'In stock',
    variants: [
      {
        color: '',
        type: '',
        price: '',
        stock: '',
        image_url: ''
      }
    ]
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
            const variants = product.variants || [];
            
            setFormData({
              product_name: product.product_name || '',
              description: product.description || '',
              category_id: product.category_id?.toString() || '',
              image: product.image || '',
              status: product.status || 'In stock',
              variants: variants.length > 0 ? variants.map(v => ({
                color: v.color || '',
                type: v.type || '',
                price: v.price?.toString() || '',
                stock: v.stock?.toString() || '',
                image_url: v.image_url || ''
              })) : [{
                color: '',
                type: '',
                price: '',
                stock: '',
                image_url: ''
              }]
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

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, {
        color: '',
        type: '',
        price: '',
        stock: '',
        image_url: ''
      }]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = async (e, variantIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      
      const response = await privateClient.post('/products/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data?.success && response.data?.data?.url) {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const fullImageUrl = baseURL.replace('/api', '') + response.data.data.url;
        
        if (variantIndex !== null) {
          // Upload for variant
          handleVariantChange(variantIndex, 'image_url', fullImageUrl);
        } else {
          // Upload for main product image
          setFormData(prev => ({ ...prev, image: fullImageUrl }));
        }
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image: ' + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name.trim()) newErrors.product_name = 'Please enter product name';
    if (!formData.category_id) newErrors.category_id = 'Please select a category';
    
    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.color.trim()) newErrors[`variant_${index}_color`] = 'Color is required';
      if (!variant.type.trim()) newErrors[`variant_${index}_type`] = 'Type is required';
      if (!variant.price || parseFloat(variant.price) <= 0) newErrors[`variant_${index}_price`] = 'Valid price required';
      if (variant.stock === '' || parseInt(variant.stock) < 0) newErrors[`variant_${index}_stock`] = 'Stock required';
    });
    
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
        image: formData.image,
        status: formData.status,
        variants: formData.variants.map(v => ({
          color: v.color,
          type: v.type,
          price: parseFloat(v.price),
          stock: parseInt(v.stock),
          image_url: v.image_url || null
        }))
      };

      if (isEditing) {
        await productService.updateProduct(productId, productData, privateClient);
        alert('Product updated successfully!');
      } else {
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
            {/* Left Column */}
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
                    rows="4"
                  />
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Main Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, null)}
                    style={{ display: 'block', marginBottom: '8px' }}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Product" style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }} />
                  )}
                </div>
              </div>

              {/* Variants */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>🎨 Variants</h3>
                
                {formData.variants.map((variant, index) => (
                  <div key={index} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong>Variant {index + 1}</strong>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={shopStyles.formLabel}>Color *</label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                          placeholder="e.g., White, Black, Blue"
                          style={{
                            ...shopStyles.formInput,
                            borderColor: errors[`variant_${index}_color`] ? '#dc3545' : '#ddd'
                          }}
                        />
                        {errors[`variant_${index}_color`] && <div style={shopStyles.formError}>{errors[`variant_${index}_color`]}</div>}
                      </div>

                      <div>
                        <label style={shopStyles.formLabel}>Type *</label>
                        <input
                          type="text"
                          value={variant.type}
                          onChange={(e) => handleVariantChange(index, 'type', e.target.value)}
                          placeholder="e.g., S, M, L, XL"
                          style={{
                            ...shopStyles.formInput,
                            borderColor: errors[`variant_${index}_type`] ? '#dc3545' : '#ddd'
                          }}
                        />
                        {errors[`variant_${index}_type`] && <div style={shopStyles.formError}>{errors[`variant_${index}_type`]}</div>}
                      </div>

                      <div>
                        <label style={shopStyles.formLabel}>Price (VND) *</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          placeholder="0"
                          min="0"
                          style={{
                            ...shopStyles.formInput,
                            borderColor: errors[`variant_${index}_price`] ? '#dc3545' : '#ddd'
                          }}
                        />
                        {errors[`variant_${index}_price`] && <div style={shopStyles.formError}>{errors[`variant_${index}_price`]}</div>}
                      </div>

                      <div>
                        <label style={shopStyles.formLabel}>Stock *</label>
                        <input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          placeholder="0"
                          min="0"
                          style={{
                            ...shopStyles.formInput,
                            borderColor: errors[`variant_${index}_stock`] ? '#dc3545' : '#ddd'
                          }}
                        />
                        {errors[`variant_${index}_stock`] && <div style={shopStyles.formError}>{errors[`variant_${index}_stock`]}</div>}
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <label style={shopStyles.formLabel}>Variant Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ display: 'block', marginBottom: '8px' }}
                      />
                      {variant.image_url && (
                        <img src={variant.image_url} alt={`Variant ${index + 1}`} style={{ maxWidth: '150px', borderRadius: '8px', marginTop: '8px' }} />
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariant}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#647A67',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ➕ Add Variant
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div>
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
                    <option value="In stock">In stock</option>
                    <option value="Out of stock">Out of stock</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div style={shopStyles.card}>
                <button
                  type="submit"
                  style={{ 
                    ...shopStyles.primaryBtn, 
                    width: '100%', 
                    justifyContent: 'center',
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {isEditing ? 'Update Product' : 'Create Product'}
                </button>
                
                <button
                  type="button"
                  style={{ 
                    ...shopStyles.secondaryBtn, 
                    width: '100%', 
                    justifyContent: 'center', 
                    marginTop: '12px',
                    padding: '14px'
                  }}
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
