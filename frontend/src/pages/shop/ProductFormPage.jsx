import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { isAuthenticated } = useSelector(state => state.auth);
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

  const categories = [
    { id: 1, name: 'Thời Trang Nam' },
    { id: 2, name: 'Thời Trang Nữ' },
    { id: 3, name: 'Điện Thoại & Phụ Kiện' },
    { id: 4, name: 'Máy Tính & Laptop' },
    { id: 5, name: 'Mỹ Phẩm' },
    { id: 6, name: 'Nhà Cửa & Đời Sống' },
    { id: 7, name: 'Thể Thao & Du Lịch' },
    { id: 8, name: 'Đồ Chơi' },
    { id: 9, name: 'Giày Dép' },
    { id: 10, name: 'Túi Xách' },
    { id: 11, name: 'Đồng Hồ' },
    { id: 12, name: 'Sức Khỏe' }
  ];

  // Load product data if editing
  useEffect(() => {
    if (isEditing && productId) {
      // Mock fetching product data
      setTimeout(() => {
        const mockProduct = {
          product_name: 'Áo thun nam cotton cao cấp Premium',
          description: 'Áo thun chất liệu cotton 100%, mềm mại và thoáng mát. Phù hợp mọi vóc dáng.',
          category_id: '1',
          price: '129000',
          oldPrice: '299000',
          stock: '150',
          status: 'Active',
          images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop'
          ],
          colors: ['Trắng', 'Đen', 'Xám'],
          sizes: ['S', 'M', 'L', 'XL']
        };
        setFormData(mockProduct);
        setLoading(false);
      }, 500);
    }
  }, [isEditing, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result].slice(0, 8) // Max 8 images
        }));
      };
      reader.readAsDataURL(file);
    });
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result].slice(0, 8)
        }));
      };
      reader.readAsDataURL(file);
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
    if (!formData.product_name.trim()) newErrors.product_name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.category_id) newErrors.category_id = 'Vui lòng chọn danh mục';
    if (!formData.price || parseInt(formData.price) <= 0) newErrors.price = 'Vui lòng nhập giá hợp lệ';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Vui lòng nhập số lượng kho';
    if (formData.images.length === 0) newErrors.images = 'Vui lòng thêm ít nhất 1 hình ảnh';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: parseInt(formData.price),
      oldPrice: formData.oldPrice ? parseInt(formData.oldPrice) : null,
      stock: parseInt(formData.stock),
      colors: formData.colors.filter(c => c.trim()),
      sizes: formData.sizes.filter(s => s.trim())
    };

    console.log('Product data:', productData);
    alert(isEditing ? 'Đã cập nhật sản phẩm!' : 'Đã tạo sản phẩm mới!');
    navigate('/shop/products');
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
            <p>Đang tải thông tin sản phẩm...</p>
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
              {isEditing ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
            </h1>
            <Link to="/shop/products" style={{ color: '#666', fontSize: '14px' }}>
              ← Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={shopStyles.formGrid}>
            {/* Left Column - Main Info */}
            <div>
              {/* Basic Info */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>📝 Thông tin cơ bản</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Tên sản phẩm <span style={{ color: '#dc3545' }}>*</span>
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
                    placeholder="Nhập tên sản phẩm"
                  />
                  {errors.product_name && <div style={shopStyles.formError}>{errors.product_name}</div>}
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Danh mục <span style={{ color: '#dc3545' }}>*</span>
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
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <div style={shopStyles.formError}>{errors.category_id}</div>}
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Mô tả sản phẩm</label>
                  <textarea
                    name="description"
                    style={shopStyles.formTextarea}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>
              </div>

              {/* Images */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>
                  🖼️ Hình ảnh sản phẩm <span style={{ color: '#dc3545' }}>*</span>
                </h3>
                
                <div
                  style={{
                    ...shopStyles.imageUpload,
                    ...(dragActive ? shopStyles.imageUploadHover : {}),
                    borderColor: errors.images ? '#dc3545' : (dragActive ? '#647A67' : '#ddd')
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
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
                  <p style={{ color: '#666', marginBottom: '4px' }}>
                    Kéo thả hình ảnh vào đây hoặc click để chọn
                  </p>
                  <p style={{ fontSize: '12px', color: '#999' }}>
                    Tối đa 8 hình ảnh, định dạng JPG, PNG
                  </p>
                </div>
                {errors.images && <div style={shopStyles.formError}>{errors.images}</div>}

                {formData.images.length > 0 && (
                  <div style={shopStyles.imagePreviewGrid}>
                    {formData.images.map((img, index) => (
                      <div key={index} style={shopStyles.imagePreview}>
                        <img src={img} alt={`Preview ${index}`} style={shopStyles.imagePreviewImg} />
                        <button
                          type="button"
                          style={shopStyles.imageRemoveBtn}
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span style={{
                            position: 'absolute',
                            bottom: '4px',
                            left: '4px',
                            backgroundColor: '#647A67',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            Ảnh chính
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>🎨 Phân loại hàng</h3>
                
                {/* Colors */}
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Màu sắc</label>
                  <div style={shopStyles.variantSection}>
                    {formData.colors.map((color, index) => (
                      <div key={index} style={shopStyles.variantRow}>
                        <input
                          type="text"
                          style={shopStyles.variantInput}
                          value={color}
                          onChange={(e) => handleVariantChange('colors', index, e.target.value)}
                          placeholder="VD: Trắng, Đen, Xanh..."
                        />
                        <button
                          type="button"
                          style={shopStyles.iconBtn}
                          onClick={() => removeVariant('colors', index)}
                          disabled={formData.colors.length <= 1}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      style={shopStyles.addVariantBtn}
                      onClick={() => addVariant('colors')}
                    >
                      ➕ Thêm màu
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Kích cỡ</label>
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
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      style={shopStyles.addVariantBtn}
                      onClick={() => addVariant('sizes')}
                    >
                      ➕ Thêm kích cỡ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Price & Status */}
            <div>
              {/* Pricing */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>💰 Giá bán</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Giá bán <span style={{ color: '#dc3545' }}>*</span>
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
                  <div style={shopStyles.formHelper}>Đơn vị: VNĐ</div>
                </div>

                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Giá gốc (trước giảm giá)</label>
                  <input
                    type="number"
                    name="oldPrice"
                    style={shopStyles.formInput}
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                  <div style={shopStyles.formHelper}>Để trống nếu không có giảm giá</div>
                </div>

                {formData.oldPrice && parseInt(formData.oldPrice) > parseInt(formData.price || 0) && (
                  <div style={{
                    backgroundColor: '#d4edda',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#155724'
                  }}>
                    🏷️ Giảm giá: {Math.round((1 - parseInt(formData.price || 0) / parseInt(formData.oldPrice)) * 100)}%
                  </div>
                )}
              </div>

              {/* Stock */}
              <div style={shopStyles.card}>
                <h3 style={shopStyles.cardTitle}>📦 Kho hàng</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>
                    Số lượng <span style={{ color: '#dc3545' }}>*</span>
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
                <h3 style={shopStyles.cardTitle}>⚙️ Trạng thái</h3>
                
                <div style={shopStyles.formSection}>
                  <label style={shopStyles.formLabel}>Trạng thái sản phẩm</label>
                  <select
                    name="status"
                    style={shopStyles.formSelect}
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Đang bán</option>
                    <option value="Inactive">Ngừng bán</option>
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
                  {isEditing ? '💾 Cập nhật sản phẩm' : '✅ Tạo sản phẩm'}
                </button>
                
                <button
                  type="button"
                  style={{ ...shopStyles.secondaryBtn, width: '100%', justifyContent: 'center', marginTop: '12px' }}
                  onClick={() => navigate('/shop/products')}
                >
                  Hủy
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
