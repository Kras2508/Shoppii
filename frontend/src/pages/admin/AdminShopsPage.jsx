import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminStyles from './adminStyles.js';
import { adminService } from '../../api/adminService.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import createPrivateClient from '../../clients/private.client';

const AdminShopsPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShop, setSelectedShop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllShops(privateClient, {
          search: searchTerm || undefined
        });
        if (response.data?.data?.shops) {
          setShops(response.data.data.shops);
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchShops();
    }
  }, [token, searchTerm]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: shops.length },
    { id: 'active', label: 'Hoạt động', count: shops.filter(s => s.account_status === 'Active').length },
    { id: 'ban', label: 'Bị ban', count: shops.filter(s => s.account_status === 'Ban').length }
  ];

  const filteredShops = shops.filter(shop => {
    const matchSearch = 
      shop.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.shop_id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || shop.shop_status === statusFilter;
    const matchTab = activeTab === 'all' || shop.account_status.toLowerCase() === activeTab;
    return matchSearch && matchStatus && matchTab;
  });

  const handleApprove = (shopId) => {
    setShops(prev => prev.map(shop => 
      shop.shop_id === shopId ? { ...shop, account_status: 'Active' } : shop
    ));
  };

  const handleReject = (shopId) => {
    setShops(prev => prev.map(shop => 
      shop.shop_id === shopId ? { ...shop, account_status: 'Ban' } : shop
    ));
  };

  const handleToggleStatus = (shopId) => {
    setShops(prev => prev.map(shop => {
      if (shop.shop_id === shopId) {
        const newStatus = shop.shop_status === 'Open' ? 'Temporarily Close' : 'Open';
        return { ...shop, shop_status: newStatus };
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
      case 'Active': return 'success';
      case 'Ban': return 'danger';
      default: return 'secondary';
    }
  };

  const getApprovalText = (status) => {
    switch (status) {
      case 'Active': return '✓ Hoạt động';
      case 'Ban': return '✕ Bị ban';
      default: return status;
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
            <div key={shop.shop_id} style={styles.shopCard}>
              <div style={styles.shopLogo}>🏪</div>
              <div style={styles.shopInfo}>
                <div style={styles.shopName}>
                  {shop.shop_name}
                  <Badge variant={getApprovalBadgeVariant(shop.account_status)} size="small">
                    {getApprovalText(shop.account_status)}
                  </Badge>
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>{shop.email}</div>
                <div style={styles.shopMeta}>
                  <Badge variant={getStatusBadgeVariant(shop.shop_status)} size="small">
                    {getStatusText(shop.shop_status)}
                  </Badge>
                  {shop.address_shop && <span>📍 {shop.address_shop.split(',')[1]?.trim() || shop.address_shop}</span>}
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
                {shop.account_status === 'Active' && (
                  <>
                    <Button
                      variant="danger"
                      size="small"
                      icon="✕"
                      onClick={() => handleReject(shop.shop_id)}
                    >
                      Ban
                    </Button>
                  </>
                )}
                {shop.account_status === 'Ban' && (
                  <>
                    <Button
                      variant="success"
                      size="small"
                      icon="✓"
                      onClick={() => handleApprove(shop.shop_id)}
                    >
                      Bỏ ban
                    </Button>
                  </>
                )}
                <Button
                  variant={shop.shop_status === 'Open' ? 'warning' : 'success'}
                  size="small"
                  icon={shop.shop_status === 'Open' ? '⏸️' : '▶️'}
                  onClick={() => handleToggleStatus(shop.shop_id)}
                >
                  {shop.shop_status === 'Open' ? 'Tạm đóng' : 'Mở lại'}
                </Button>
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
              {selectedShop.account_status === 'Active' && (
                <>
                  <Button
                    variant="danger"
                    icon="✕"
                    onClick={() => { handleReject(selectedShop.shop_id); setShowModal(false); }}
                  >
                    Ban
                  </Button>
                </>
              )}
              {selectedShop.account_status === 'Ban' && (
                <>
                  <Button
                    variant="success"
                    icon="✓"
                    onClick={() => { handleApprove(selectedShop.shop_id); setShowModal(false); }}
                  >
                    Bỏ ban
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
                  <Badge variant={getApprovalBadgeVariant(selectedShop.account_status)}>
                    {getApprovalText(selectedShop.account_status)}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(selectedShop.shop_status)}>
                    {getStatusText(selectedShop.shop_status)}
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
              <div style={styles.infoValue}>{selectedShop.address_shop || 'Chưa cập nhật'}</div>
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
