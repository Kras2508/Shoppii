import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';

const ShopProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Mock products data
  const [products, setProducts] = useState([
    {
      product_id: 1,
      product_name: 'Áo thun nam cotton cao cấp Premium',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      category: 'Thời Trang Nam',
      price: 129000,
      stock: 150,
      sold: 234,
      status: 'Active',
      rating: 4.8
    },
    {
      product_id: 2,
      product_name: 'Quần jean nam slim fit cao cấp',
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=200&fit=crop',
      category: 'Thời Trang Nam',
      price: 259000,
      stock: 85,
      sold: 156,
      status: 'Active',
      rating: 4.9
    },
    {
      product_id: 3,
      product_name: 'Giày thể thao nam sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      category: 'Giày Dép',
      price: 449000,
      stock: 0,
      sold: 98,
      status: 'Out of Stock',
      rating: 4.7
    },
    {
      product_id: 4,
      product_name: 'Túi xách nữ da PU cao cấp',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
      category: 'Túi Xách',
      price: 199000,
      stock: 45,
      sold: 312,
      status: 'Active',
      rating: 4.6
    },
    {
      product_id: 5,
      product_name: 'Đồng hồ thông minh smartwatch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      category: 'Đồng Hồ',
      price: 599000,
      stock: 20,
      sold: 67,
      status: 'Inactive',
      rating: 4.9
    }
  ]);

  const categories = ['Tất cả', 'Thời Trang Nam', 'Thời Trang Nữ', 'Giày Dép', 'Túi Xách', 'Đồng Hồ', 'Điện Tử'];

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return { ...shopStyles.statusBadge, ...shopStyles.statusActive };
      case 'Inactive':
        return { ...shopStyles.statusBadge, ...shopStyles.statusInactive };
      case 'Out of Stock':
        return { ...shopStyles.statusBadge, ...shopStyles.statusOutOfStock };
      default:
        return shopStyles.statusBadge;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Đang bán';
      case 'Inactive': return 'Ngừng bán';
      case 'Out of Stock': return 'Hết hàng';
      default: return status;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.product_id !== productToDelete.product_id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  return (
    <div style={shopStyles.page}>
      <div style={shopStyles.container}>
        {/* Header */}
        <div style={shopStyles.pageHeader}>
          <div>
            <h1 style={shopStyles.pageTitle}>📦 Quản lý sản phẩm</h1>
            <p style={{ color: '#666', marginTop: '4px' }}>
              {products.length} sản phẩm
            </p>
          </div>
          <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
            <button style={shopStyles.primaryBtn}>
              ➕ Thêm sản phẩm mới
            </button>
          </Link>
        </div>

        {/* Filters */}
        <div style={shopStyles.card}>
          <div style={shopStyles.filterRow}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              style={shopStyles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              style={shopStyles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Active">Đang bán</option>
              <option value="Inactive">Ngừng bán</option>
              <option value="Out of Stock">Hết hàng</option>
            </select>
            <select
              style={shopStyles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div style={shopStyles.card}>
          {filteredProducts.length === 0 ? (
            <div style={shopStyles.emptyState}>
              <div style={shopStyles.emptyIcon}>📦</div>
              <p style={shopStyles.emptyText}>Không tìm thấy sản phẩm nào</p>
              <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
                <button style={shopStyles.primaryBtn}>
                  ➕ Thêm sản phẩm đầu tiên
                </button>
              </Link>
            </div>
          ) : (
            <table style={shopStyles.table}>
              <thead style={shopStyles.tableHeader}>
                <tr>
                  <th style={shopStyles.th}>Sản phẩm</th>
                  <th style={shopStyles.th}>Giá</th>
                  <th style={shopStyles.th}>Kho</th>
                  <th style={shopStyles.th}>Đã bán</th>
                  <th style={shopStyles.th}>Trạng thái</th>
                  <th style={shopStyles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.product_id}>
                    <td style={shopStyles.td}>
                      <div style={shopStyles.productRow}>
                        <img
                          src={product.image}
                          alt={product.product_name}
                          style={shopStyles.productImage}
                        />
                        <div style={shopStyles.productInfo}>
                          <div style={shopStyles.productName}>{product.product_name}</div>
                          <div style={shopStyles.productCategory}>{product.category}</div>
                          <div style={{ fontSize: '12px', color: '#FFB800' }}>
                            ⭐ {product.rating}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={shopStyles.td}>
                      <strong style={{ color: '#647A67' }}>{formatPrice(product.price)}</strong>
                    </td>
                    <td style={shopStyles.td}>
                      <span style={{ color: product.stock === 0 ? '#dc3545' : '#333' }}>
                        {product.stock}
                      </span>
                    </td>
                    <td style={shopStyles.td}>{product.sold}</td>
                    <td style={shopStyles.td}>
                      <span style={getStatusStyle(product.status)}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td style={shopStyles.td}>
                      <div style={shopStyles.actions}>
                        <button
                          style={shopStyles.iconBtn}
                          title="Xem"
                          onClick={() => navigate(`/product/${product.product_id}`)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          👁️
                        </button>
                        <button
                          style={shopStyles.iconBtn}
                          title="Sửa"
                          onClick={() => navigate(`/shop/products/edit/${product.product_id}`)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fff0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          ✏️
                        </button>
                        <button
                          style={{ ...shopStyles.iconBtn, borderColor: '#ffcccc' }}
                          title="Xóa"
                          onClick={() => handleDeleteClick(product)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#fff0f0'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Back to Dashboard */}
        <div style={{ marginTop: '20px' }}>
          <Link to="/shop" style={{ color: '#647A67', textDecoration: 'none' }}>
            ← Quay lại Dashboard
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={shopStyles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={shopStyles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={shopStyles.modalTitle}>🗑️ Xác nhận xóa sản phẩm</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Bạn có chắc chắn muốn xóa sản phẩm <strong>"{productToDelete?.product_name}"</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </p>
            <div style={shopStyles.modalActions}>
              <button
                style={shopStyles.secondaryBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                style={shopStyles.dangerBtn}
                onClick={handleDeleteConfirm}
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopProductsPage;
