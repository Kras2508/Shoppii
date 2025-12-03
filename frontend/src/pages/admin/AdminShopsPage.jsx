import React, { useState } from 'react';
import adminStyles from './adminStyles.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminShopsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShop, setSelectedShop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved

  // Mock data
  const [shops, setShops] = useState([
    { 
      id: 1, shop_id: 'SHOP001', shop_name: 'Fashion House', email: 'shop.fashion@gmail.com',
      status: 'Open', approval_status: 'Approved', rating: 4.8, total_products: 156, 
      total_orders: 1245, total_revenue: 450000000, created_at: '2024-01-10',
      phone: '0901234567', address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Shop thời trang nam nữ cao cấp'
    },
    { 
      id: 2, shop_id: 'SHOP002', shop_name: 'Tech World', email: 'shop.tech@gmail.com',
      status: 'Open', approval_status: 'Approved', rating: 4.9, total_products: 89, 
      total_orders: 980, total_revenue: 890000000, created_at: '2024-01-22',
      phone: '0909876543', address: '456 Lê Lợi, Q.1, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Đồ công nghệ chính hãng'
    },
    { 
      id: 3, shop_id: 'SHOP003', shop_name: 'Beauty Corner', email: 'shop.beauty@gmail.com',
      status: 'Open', approval_status: 'Approved', rating: 4.6, total_products: 234, 
      total_orders: 654, total_revenue: 180000000, created_at: '2024-02-15',
      phone: '0912345678', address: '789 Trần Hưng Đạo, Q.5, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Mỹ phẩm và skincare'
    },
    { 
      id: 4, shop_id: 'SHOP004', shop_name: 'Home & Living', email: 'shop.home@gmail.com',
      status: 'Temporarily Close', approval_status: 'Approved', rating: 4.7, total_products: 178, 
      total_orders: 756, total_revenue: 320000000, created_at: '2024-01-28',
      phone: '0923456789', address: '321 Võ Văn Tần, Q.3, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Nội thất và đồ gia dụng'
    },
    { 
      id: 5, shop_id: 'SHOP005', shop_name: 'New Fashion', email: 'newfashion@gmail.com',
      status: 'Closed', approval_status: 'Pending', rating: 0, total_products: 0, 
      total_orders: 0, total_revenue: 0, created_at: '2024-04-20',
      phone: '0934567890', address: '654 Hai Bà Trưng, Q.1, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Thời trang trẻ trung'
    },
    { 
      id: 6, shop_id: 'SHOP006', shop_name: 'Gadget Zone', email: 'gadget@gmail.com',
      status: 'Closed', approval_status: 'Pending', rating: 0, total_products: 0, 
      total_orders: 0, total_revenue: 0, created_at: '2024-04-22',
      phone: '0945678901', address: '987 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Phụ kiện điện thoại'
    },
    { 
      id: 7, shop_id: 'SHOP007', shop_name: 'Sports Zone', email: 'sports@gmail.com',
      status: 'Open', approval_status: 'Approved', rating: 4.5, total_products: 120, 
      total_orders: 543, total_revenue: 250000000, created_at: '2024-02-05',
      phone: '0956789012', address: '147 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Đồ thể thao chính hãng'
    },
    { 
      id: 8, shop_id: 'SHOP008', shop_name: 'Book World', email: 'bookworld@gmail.com',
      status: 'Closed', approval_status: 'Rejected', rating: 0, total_products: 0, 
      total_orders: 0, total_revenue: 0, created_at: '2024-03-15',
      phone: '0967890123', address: '258 Cách Mạng Tháng 8, Q.10, TP.HCM',
      logo: 'https://via.placeholder.com/80', description: 'Sách và văn phòng phẩm'
    }
  ]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: shops.length },
    { id: 'pending', label: 'Chờ duyệt', count: shops.filter(s => s.approval_status === 'Pending').length },
    { id: 'approved', label: 'Đã duyệt', count: shops.filter(s => s.approval_status === 'Approved').length },
    { id: 'rejected', label: 'Từ chối', count: shops.filter(s => s.approval_status === 'Rejected').length }
  ];

  const filteredShops = shops.filter(shop => {
    const matchSearch = 
      shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.shop_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || shop.status === statusFilter;
    const matchTab = activeTab === 'all' || shop.approval_status.toLowerCase() === activeTab;
    return matchSearch && matchStatus && matchTab;
  });

  const handleApprove = (shopId) => {
    setShops(prev => prev.map(shop => 
      shop.id === shopId ? { ...shop, approval_status: 'Approved', status: 'Open' } : shop
    ));
  };

  const handleReject = (shopId) => {
    setShops(prev => prev.map(shop => 
      shop.id === shopId ? { ...shop, approval_status: 'Rejected' } : shop
    ));
  };

  const handleToggleStatus = (shopId) => {
    setShops(prev => prev.map(shop => {
      if (shop.id === shopId) {
        const newStatus = shop.status === 'Open' ? 'Temporarily Close' : 'Open';
        return { ...shop, status: newStatus };
      }
      return shop;
    }));
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + ' tỷ';
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + ' triệu';
    }
    return amount.toLocaleString('vi-VN');
  };

  const styles = {
    ...adminStyles,
    tabContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      borderBottom: '1px solid #eee',
      paddingBottom: '12px'
    },
    tab: {
      padding: '10px 20px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#666',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'all 0.2s'
    },
    tabActive: {
      backgroundColor: '#1a1a2e',
      color: 'white'
    },
    tabBadge: {
      marginLeft: '8px',
      padding: '2px 8px',
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      fontSize: '11px'
    },
    filterRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      alignItems: 'flex-end'
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minWidth: '180px',
      outline: 'none',
      cursor: 'pointer'
    },
    shopCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '12px',
      border: '1px solid #eee',
      transition: 'all 0.2s'
    },
    shopLogo: {
      width: '60px',
      height: '60px',
      borderRadius: '10px',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    shopInfo: {
      flex: 1
    },
    shopName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    shopMeta: {
      fontSize: '13px',
      color: '#666',
      display: 'flex',
      gap: '16px',
      marginTop: '6px',
      alignItems: 'center'
    },
    shopStats: {
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    },
    statItem: {
      textAlign: 'center'
    },
    statValue: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#333'
    },
    statLabel: {
      fontSize: '11px',
      color: '#999',
      marginTop: '2px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    infoItem: {
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    infoLabel: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '4px'
    },
    infoValue: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Open': return 'success';
      case 'Temporarily Close': return 'warning';
      case 'Closed': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Open': return '🟢 Đang mở';
      case 'Temporarily Close': return '🟡 Tạm đóng';
      case 'Closed': return '🔴 Đã đóng';
      default: return status;
    }
  };

  const getApprovalBadgeVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={adminStyles.pageTitle}>Quản lý Shops</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Tổng: <strong>{shops.length}</strong> shop
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #2ecc71' }}>
          <div>
            <div style={adminStyles.statLabel}>Đang hoạt động</div>
            <div style={adminStyles.statValue}>{shops.filter(s => s.status === 'Open').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>🟢</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #f39c12' }}>
          <div>
            <div style={adminStyles.statLabel}>Chờ duyệt</div>
            <div style={adminStyles.statValue}>{shops.filter(s => s.approval_status === 'Pending').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>⏳</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #3498db' }}>
          <div>
            <div style={adminStyles.statLabel}>Tổng sản phẩm</div>
            <div style={adminStyles.statValue}>{shops.reduce((sum, s) => sum + s.total_products, 0)}</div>
          </div>
          <span style={{ fontSize: '32px' }}>📦</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #e74c3c' }}>
          <div>
            <div style={adminStyles.statLabel}>Tổng doanh thu</div>
            <div style={adminStyles.statValue}>{formatCurrency(shops.reduce((sum, s) => sum + s.total_revenue, 0))}đ</div>
          </div>
          <span style={{ fontSize: '32px' }}>💰</span>
        </div>
      </div>

      {/* Main Card */}
      <div style={adminStyles.card}>
        {/* Tabs */}
        <div style={styles.tabContainer}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {})
              }}
            >
              {tab.label}
              <span style={{
                ...styles.tabBadge,
                backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : '#e0e0e0',
                color: activeTab === tab.id ? 'white' : '#666'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="🔍 Tìm kiếm theo tên shop, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Open">Đang mở</option>
            <option value="Temporarily Close">Tạm đóng</option>
            <option value="Closed">Đã đóng</option>
          </select>
        </div>

        {/* Shop List */}
        {filteredShops.map(shop => {
          return (
            <div key={shop.id} style={styles.shopCard}>
              <div style={styles.shopLogo}>🏪</div>
              <div style={styles.shopInfo}>
                <div style={styles.shopName}>
                  {shop.shop_name}
                  <Badge variant={getApprovalBadgeVariant(shop.approval_status)} size="small">
                    {shop.approval_status}
                  </Badge>
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>{shop.email}</div>
                <div style={styles.shopMeta}>
                  <Badge variant={getStatusBadgeVariant(shop.status)} size="small">
                    {getStatusText(shop.status)}
                  </Badge>
                  <span>📍 {shop.address.split(',')[1]?.trim()}</span>
                  {shop.rating > 0 && <span>⭐ {shop.rating}</span>}
                </div>
              </div>
              
              <div style={styles.shopStats}>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{shop.total_products}</div>
                  <div style={styles.statLabel}>Sản phẩm</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{shop.total_orders}</div>
                  <div style={styles.statLabel}>Đơn hàng</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statValue, color: '#e74c3c' }}>{formatCurrency(shop.total_revenue)}đ</div>
                  <div style={styles.statLabel}>Doanh thu</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  variant="primary"
                  size="small"
                  icon="👁️"
                  onClick={() => { setSelectedShop(shop); setShowModal(true); }}
                >
                  Chi tiết
                </Button>
                {shop.approval_status === 'Pending' && (
                  <>
                    <Button
                      variant="success"
                      size="small"
                      icon="✓"
                      onClick={() => handleApprove(shop.id)}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      icon="✕"
                      onClick={() => handleReject(shop.id)}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                {shop.approval_status === 'Approved' && (
                  <Button
                    variant={shop.status === 'Open' ? 'warning' : 'success'}
                    size="small"
                    icon={shop.status === 'Open' ? '⏸️' : '▶️'}
                    onClick={() => handleToggleStatus(shop.id)}
                  >
                    {shop.status === 'Open' ? 'Tạm đóng' : 'Mở lại'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {filteredShops.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Không tìm thấy shop nào
          </div>
        )}
      </div>

      {/* Shop Detail Modal */}
      {showModal && selectedShop && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Chi tiết Shop"
          size="large"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
              {selectedShop.approval_status === 'Pending' && (
                <>
                  <Button
                    variant="success"
                    icon="✓"
                    onClick={() => { handleApprove(selectedShop.id); setShowModal(false); }}
                  >
                    Duyệt Shop
                  </Button>
                  <Button
                    variant="danger"
                    icon="✕"
                    onClick={() => { handleReject(selectedShop.id); setShowModal(false); }}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </div>
          }
        >
          <>
            {/* Shop Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ ...styles.shopLogo, width: '80px', height: '80px', fontSize: '36px' }}>🏪</div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '22px' }}>{selectedShop.shop_name}</h2>
                <div style={{ color: '#666', fontSize: '14px' }}>{selectedShop.email}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Badge variant={getApprovalBadgeVariant(selectedShop.approval_status)}>
                    {selectedShop.approval_status}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(selectedShop.status)}>
                    {getStatusText(selectedShop.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Shop ID</div>
                <div style={styles.infoValue}>{selectedShop.shop_id}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Số điện thoại</div>
                <div style={styles.infoValue}>{selectedShop.phone}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Ngày đăng ký</div>
                <div style={styles.infoValue}>{new Date(selectedShop.created_at).toLocaleDateString('vi-VN')}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Đánh giá</div>
                <div style={styles.infoValue}>⭐ {selectedShop.rating || 'Chưa có'}</div>
              </div>
            </div>

            <div style={{ ...styles.infoItem, marginTop: '16px' }}>
              <div style={styles.infoLabel}>Địa chỉ</div>
              <div style={styles.infoValue}>{selectedShop.address}</div>
            </div>

            <div style={{ ...styles.infoItem, marginTop: '16px' }}>
              <div style={styles.infoLabel}>Mô tả</div>
              <div style={styles.infoValue}>{selectedShop.description}</div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#e8f4fd', borderRadius: '10px' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#3498db' }}>{selectedShop.total_products}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Sản phẩm</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#e8f8f0', borderRadius: '10px' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#2ecc71' }}>{selectedShop.total_orders}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Đơn hàng</div>
              </div>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fdf2e8', borderRadius: '10px' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#e74c3c' }}>{formatCurrency(selectedShop.total_revenue)}đ</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Doanh thu</div>
            </div>
          </div>
        </>
      </Modal>
      )}
    </div>
  );
};

export default AdminShopsPage;
