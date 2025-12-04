import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { productService } from '../../api/productService';
import { categoryService } from '../../api/categoryService';
import createPrivateClient from '../../clients/private.client';

const ShopProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          productService.getMyShopProducts(privateClient),
          categoryService.getCategories()
        ]);
        
        if (productsRes.data?.data?.products) {
          setProducts(productsRes.data.data.products.map(p => ({
            product_id: p.product_id,
            product_name: p.product_name,
            image: p.image,
            category: p.category_name,
            price: p.min_price || 0,
            stock: p.total_stock || 0,
            sold: p.total_sold || 0,
            status: p.status,
            rating: p.avg_rating || 0
          })));
        }
        
        if (categoriesRes.data?.data) {
          setCategories(['Tất cả', ...categoriesRes.data.data.map(c => c.category_name)]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, navigate, token]);

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

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete.product_id, privateClient);
        setProducts(products.filter(p => p.product_id !== productToDelete.product_id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại!');
      }
    }
  };

  if (loading) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
