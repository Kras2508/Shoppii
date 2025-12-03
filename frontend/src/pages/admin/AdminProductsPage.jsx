import React, { useState } from 'react';
import adminStyles from './adminStyles.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data
  const [products, setProducts] = useState([
    { 
      id: 1, product_id: 'PRD001', name: 'Áo thun nam basic', shop_name: 'Fashion House',
      category: 'Thời trang', price: 299000, stock: 150, sold: 1245, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-01-15', rating: 4.8
    },
    { 
      id: 2, product_id: 'PRD002', name: 'iPhone 15 Pro Max 256GB', shop_name: 'Tech World',
      category: 'Điện tử', price: 34990000, stock: 25, sold: 89, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-01-20', rating: 4.9
    },
    { 
      id: 3, product_id: 'PRD003', name: 'Son môi MAC Ruby Woo', shop_name: 'Beauty Corner',
      category: 'Mỹ phẩm', price: 650000, stock: 80, sold: 567, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-02-10', rating: 4.7
    },
    { 
      id: 4, product_id: 'PRD004', name: 'Giày Nike Air Max', shop_name: 'Sports Zone',
      category: 'Thể thao', price: 2890000, stock: 45, sold: 234, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-02-15', rating: 4.6
    },
    { 
      id: 5, product_id: 'PRD005', name: 'Bàn làm việc gỗ', shop_name: 'Home & Living',
      category: 'Nội thất', price: 1990000, stock: 20, sold: 78, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-03-01', rating: 4.5
    },
    { 
      id: 6, product_id: 'PRD006', name: 'iPhone 15 Pro Fake', shop_name: 'Gadget Zone',
      category: 'Điện tử', price: 5990000, stock: 0, sold: 12, status: 'Banned',
      image: 'https://via.placeholder.com/80', created_at: '2024-03-15', rating: 2.1,
      ban_reason: 'Sản phẩm giả mạo, vi phạm chính sách'
    },
    { 
      id: 7, product_id: 'PRD007', name: 'Túi xách nữ Gucci', shop_name: 'Fashion House',
      category: 'Thời trang', price: 890000, stock: 35, sold: 456, status: 'Reported',
      image: 'https://via.placeholder.com/80', created_at: '2024-03-20', rating: 4.4,
      report_count: 5, report_reason: 'Nghi ngờ hàng nhái'
    },
    { 
      id: 8, product_id: 'PRD008', name: 'Tai nghe Sony WH-1000XM5', shop_name: 'Tech World',
      category: 'Điện tử', price: 8990000, stock: 15, sold: 123, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-04-01', rating: 4.9
    },
    { 
      id: 9, product_id: 'PRD009', name: 'Kem chống nắng Anessa', shop_name: 'Beauty Corner',
      category: 'Mỹ phẩm', price: 450000, stock: 100, sold: 890, status: 'Active',
      image: 'https://via.placeholder.com/80', created_at: '2024-04-05', rating: 4.8
    },
    { 
      id: 10, product_id: 'PRD010', name: 'Thuốc lá điện tử', shop_name: 'Unknown Shop',
      category: 'Khác', price: 990000, stock: 50, sold: 23, status: 'Banned',
      image: 'https://via.placeholder.com/80', created_at: '2024-04-10', rating: 0,
      ban_reason: 'Sản phẩm cấm bán'
    }
  ]);

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
