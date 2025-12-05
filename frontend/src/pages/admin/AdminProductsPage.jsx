import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminStyles from './adminStyles.js';
import { adminService } from '../../api/adminService.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import createPrivateClient from '../../clients/private.client';

const AdminProductsPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllProducts(privateClient, {
          search: searchTerm || undefined
        });
        if (response.data?.data?.products) {
          setProducts(response.data.data.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProducts();
    }
  }, [token, searchTerm]);

  const categories = ['Thời trang', 'Điện tử', 'Mỹ phẩm', 'Thể thao', 'Nội thất', 'Khác'];

  const filteredProducts = products.filter(product => {
    const matchSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleBanProduct = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, status: 'Banned', ban_reason: 'Vi phạm chính sách' } : product
    ));
  };

  const handleUnbanProduct = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, status: 'Active', ban_reason: null } : product
    ));
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const styles = {
    ...adminStyles,
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    filterRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minWidth: '150px',
      outline: 'none',
      cursor: 'pointer'
    },
    productRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      borderBottom: '1px solid #eee'
    },
    productImage: {
      width: '70px',
      height: '70px',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    productInfo: {
      flex: 1
    },
    productName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '4px'
    },
    productMeta: {
      fontSize: '13px',
      color: '#666'
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Banned': return 'danger';
      case 'Reported': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={adminStyles.pageTitle}>Quản lý Sản phẩm</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Tổng: <strong>{products.length}</strong> sản phẩm
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #3498db' }}>
          <div>
            <div style={adminStyles.statLabel}>Tổng sản phẩm</div>
            <div style={adminStyles.statValue}>{products.length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>📦</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #2ecc71' }}>
          <div>
            <div style={adminStyles.statLabel}>Đang bán</div>
            <div style={adminStyles.statValue}>{products.filter(p => p.status === 'Active').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>✅</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #f39c12' }}>
          <div>
            <div style={adminStyles.statLabel}>Bị báo cáo</div>
            <div style={adminStyles.statValue}>{products.filter(p => p.status === 'Reported').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>⚠️</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #e74c3c' }}>
          <div>
            <div style={adminStyles.statLabel}>Đã cấm</div>
            <div style={adminStyles.statValue}>{products.filter(p => p.status === 'Banned').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>🚫</span>
        </div>
      </div>

      {/* Main Card */}
      <div style={adminStyles.card}>
        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <Input
              placeholder="🔍 Tìm kiếm theo tên sản phẩm, shop, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang bán</option>
            <option value="Reported">Bị báo cáo</option>
            <option value="Banned">Đã cấm</option>
          </select>
        </div>

        {/* Product List */}
        <div>
          {filteredProducts.map(product => {
            return (
              <div key={product.id} style={styles.productRow}>
                <div style={styles.productImage}>📱</div>
                <div style={styles.productInfo}>
                  <div style={styles.productName}>
                    {product.name}
                    {product.status === 'Reported' && (
                      <span style={{ color: '#f39c12', marginLeft: '8px', fontSize: '12px' }}>
                        ({product.report_count} báo cáo)
                      </span>
                    )}
                  </div>
                  <div style={styles.productMeta}>
                    <span>🏪 {product.shop_name}</span>
                    <span style={{ marginLeft: '16px' }}>📂 {product.category}</span>
                    <span style={{ marginLeft: '16px' }}>⭐ {product.rating}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#e74c3c' }}>{formatCurrency(product.price)}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Đã bán: {product.sold}</div>
                </div>
                <div style={{ minWidth: '100px', textAlign: 'center' }}>
                  <Badge variant={getStatusBadgeVariant(product.status)} size="small">
                    {product.status}
                  </Badge>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => { setSelectedProduct(product); setShowModal(true); }}
                  >
                    👁️
                  </Button>
                  {product.status !== 'Banned' ? (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleBanProduct(product.id)}
                    >
                      🚫
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => handleUnbanProduct(product.id)}
                    >
                      ✓
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Chi tiết Sản phẩm"
          size="large"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
              {selectedProduct.status !== 'Banned' ? (
                <Button
                  variant="danger"
                  icon="🚫"
                  onClick={() => { handleBanProduct(selectedProduct.id); setShowModal(false); }}
                >
                  Cấm sản phẩm
                </Button>
              ) : (
                <Button
                  variant="success"
                  icon="✓"
                  onClick={() => { handleUnbanProduct(selectedProduct.id); setShowModal(false); }}
                >
                  Bỏ cấm
                </Button>
              )}
            </div>
          }
        >
          <>
            {/* Product Header */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ ...styles.productImage, width: '120px', height: '120px', fontSize: '48px' }}>📱</div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{selectedProduct.name}</h2>
                <div style={{ color: '#666', marginBottom: '8px' }}>🏪 {selectedProduct.shop_name}</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c', marginBottom: '8px' }}>
                  {formatCurrency(selectedProduct.price)}
                </div>
                <Badge variant={getStatusBadgeVariant(selectedProduct.status)}>
                  {selectedProduct.status}
                </Badge>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Product ID</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedProduct.product_id}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Danh mục</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedProduct.category}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Tồn kho</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedProduct.stock}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Đã bán</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedProduct.sold}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Đánh giá</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>⭐ {selectedProduct.rating}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Ngày đăng</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{new Date(selectedProduct.created_at).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            {/* Ban Reason */}
            {selectedProduct.ban_reason && (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#721c24', marginBottom: '4px' }}>Lý do cấm</div>
                <div style={{ fontSize: '14px', color: '#721c24', fontWeight: '500' }}>{selectedProduct.ban_reason}</div>
              </div>
            )}

          {/* Report Info */}
          {selectedProduct.status === 'Reported' && (
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#856404', marginBottom: '4px' }}>Thông tin báo cáo</div>
              <div style={{ fontSize: '14px', color: '#856404' }}>
                <strong>{selectedProduct.report_count} báo cáo:</strong> {selectedProduct.report_reason}
              </div>
            </div>
          )}
        </>
      </Modal>
      )}
    </div>
  );
};

export default AdminProductsPage;
