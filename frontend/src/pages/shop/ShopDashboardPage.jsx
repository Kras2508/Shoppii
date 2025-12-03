import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';

const ShopDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Mock shop data
  const shopData = {
    shop_id: 1,
    shop_name: user?.full_name ? `Shop của ${user.full_name}` : 'Shop của tôi',
    rating: 4.8,
    followers: 1250,
    totalProducts: 24,
    totalOrders: 156,
    totalRevenue: 45680000,
    pendingOrders: 5,
    processingOrders: 12,
    completedOrders: 139
  };

  // Mock recent orders
  const recentOrders = [
    { order_id: 1001, customer: 'Nguyễn Văn A', total: 258000, status: 'Processing', date: '2024-12-01' },
    { order_id: 1002, customer: 'Trần Thị B', total: 459000, status: 'Shipped', date: '2024-12-01' },
    { order_id: 1003, customer: 'Lê Văn C', total: 129000, status: 'Pending', date: '2024-11-30' },
    { order_id: 1004, customer: 'Phạm Thị D', total: 789000, status: 'Delivered', date: '2024-11-30' },
  ];

  // Mock top products
  const topProducts = [
    { id: 1, name: 'Áo thun nam cotton cao cấp', sold: 234, revenue: 30186000 },
    { id: 2, name: 'Quần jean nam slim fit', sold: 156, revenue: 40404000 },
    { id: 3, name: 'Giày thể thao sneaker', sold: 98, revenue: 44002000 },
  ];

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { ...shopStyles.statusBadge, backgroundColor: '#fff3cd', color: '#856404' };
      case 'Processing': return { ...shopStyles.statusBadge, backgroundColor: '#cce5ff', color: '#004085' };
      case 'Shipped': return { ...shopStyles.statusBadge, backgroundColor: '#d4edda', color: '#155724' };
      case 'Delivered': return { ...shopStyles.statusBadge, backgroundColor: '#d4edda', color: '#155724' };
      default: return shopStyles.statusBadge;
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
            <h1 style={shopStyles.pageTitle}>🏪 {shopData.shop_name}</h1>
            <p style={{ color: '#666', marginTop: '4px' }}>
              ⭐ {shopData.rating} | 👥 {shopData.followers.toLocaleString()} người theo dõi
            </p>
          </div>
          <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
            <button style={shopStyles.primaryBtn}>
              ➕ Thêm sản phẩm mới
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={shopStyles.statsGrid}>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>📦</div>
            <div style={shopStyles.statValue}>{shopData.totalProducts}</div>
            <div style={shopStyles.statLabel}>Sản phẩm</div>
          </div>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>🛒</div>
            <div style={shopStyles.statValue}>{shopData.totalOrders}</div>
            <div style={shopStyles.statLabel}>Đơn hàng</div>
          </div>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>⏳</div>
            <div style={shopStyles.statValue}>{shopData.pendingOrders}</div>
            <div style={shopStyles.statLabel}>Chờ xử lý</div>
          </div>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>💰</div>
            <div style={shopStyles.statValue}>{(shopData.totalRevenue / 1000000).toFixed(1)}M</div>
            <div style={shopStyles.statLabel}>Doanh thu</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Recent Orders */}
          <div style={shopStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ ...shopStyles.cardTitle, marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                📋 Đơn hàng gần đây
              </h2>
              <Link to="/shop/orders" style={{ color: '#647A67', fontSize: '14px' }}>
                Xem tất cả →
              </Link>
            </div>
            
            <table style={shopStyles.table}>
              <thead style={shopStyles.tableHeader}>
                <tr>
                  <th style={shopStyles.th}>Mã đơn</th>
                  <th style={shopStyles.th}>Khách hàng</th>
                  <th style={shopStyles.th}>Tổng tiền</th>
                  <th style={shopStyles.th}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.order_id}>
                    <td style={shopStyles.td}>#{order.order_id}</td>
                    <td style={shopStyles.td}>{order.customer}</td>
                    <td style={shopStyles.td}>{formatPrice(order.total)}</td>
                    <td style={shopStyles.td}>
                      <span style={getStatusStyle(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Products */}
          <div style={shopStyles.card}>
            <h2 style={shopStyles.cardTitle}>🏆 Sản phẩm bán chạy</h2>
            
            {topProducts.map((product, index) => (
              <div key={product.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                borderBottom: index < topProducts.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '12px'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Đã bán: {product.sold}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#647A67' }}>
                  {formatPrice(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={shopStyles.card}>
          <h2 style={shopStyles.cardTitle}>⚡ Thao tác nhanh</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/shop/products" style={{ textDecoration: 'none' }}>
              <button style={shopStyles.secondaryBtn}>
                📦 Quản lý sản phẩm
              </button>
            </Link>
            <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
              <button style={shopStyles.secondaryBtn}>
                ➕ Thêm sản phẩm
              </button>
            </Link>
            <Link to="/shop/reports" style={{ textDecoration: 'none' }}>
              <button style={shopStyles.secondaryBtn}>
                📊 Xem báo cáo
              </button>
            </Link>
            <Link to="/shop/settings" style={{ textDecoration: 'none' }}>
              <button style={shopStyles.secondaryBtn}>
                ⚙️ Cài đặt shop
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
