import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import adminStyles from './adminStyles.js';

const AdminDashboard = () => {
  // Mock data - sẽ thay bằng API calls sau
  const stats = {
    totalUsers: 15420,
    totalShops: 856,
    totalOrders: 45230,
    totalRevenue: 12500000000, // 12.5 tỷ
    newUsersToday: 128,
    newOrdersToday: 342,
    pendingShops: 12,
    reportedReviews: 8
  };

  const recentActivities = [
    { id: 1, type: 'user', action: 'Người dùng mới đăng ký', detail: 'nguyenvana@gmail.com', time: '2 phút trước', icon: '👤' },
    { id: 2, type: 'shop', action: 'Shop mới yêu cầu xác minh', detail: 'Fashion Store', time: '5 phút trước', icon: '🏪' },
    { id: 3, type: 'order', action: 'Đơn hàng mới', detail: '#ORD-12345 - 2,500,000đ', time: '8 phút trước', icon: '🛒' },
    { id: 4, type: 'report', action: 'Review bị báo cáo', detail: 'Nội dung không phù hợp', time: '15 phút trước', icon: '⚠️' },
    { id: 5, type: 'user', action: 'Người dùng mới đăng ký', detail: 'tranthib@gmail.com', time: '20 phút trước', icon: '👤' },
    { id: 6, type: 'shop', action: 'Shop đã được xác minh', detail: 'Tech World', time: '30 phút trước', icon: '✅' },
    { id: 7, type: 'order', action: 'Đơn hàng hoàn thành', detail: '#ORD-12340 - 1,200,000đ', time: '45 phút trước', icon: '📦' },
    { id: 8, type: 'product', action: 'Sản phẩm bị báo cáo', detail: 'iPhone 15 Pro Max (fake)', time: '1 giờ trước', icon: '📱' }
  ];

  const topShops = [
    { id: 1, name: 'Fashion House', orders: 1245, revenue: 450000000, rating: 4.8 },
    { id: 2, name: 'Tech World', orders: 980, revenue: 890000000, rating: 4.9 },
    { id: 3, name: 'Home & Living', orders: 756, revenue: 320000000, rating: 4.7 },
    { id: 4, name: 'Beauty Corner', orders: 654, revenue: 180000000, rating: 4.6 },
    { id: 5, name: 'Sports Zone', orders: 543, revenue: 250000000, rating: 4.5 }
  ];

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
    welcomeCard: {
      backgroundColor: '#1a1a2e',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '24px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    welcomeText: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    welcomeSubtext: {
      fontSize: '14px',
      opacity: 0.8
    },
    statIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      marginTop: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1a1a2e'
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid #eee'
    },
    activityIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      backgroundColor: '#f0f2f5'
    },
    activityContent: {
      flex: 1
    },
    activityAction: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    activityDetail: {
      fontSize: '12px',
      color: '#666',
      marginTop: '2px'
    },
    activityTime: {
      fontSize: '12px',
      color: '#999'
    },
    quickActionBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 16px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #ddd',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      color: '#333'
    },
    shopRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #eee'
    },
    shopRank: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '700',
      marginRight: '12px'
    },
    chartPlaceholder: {
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      padding: '40px',
      textAlign: 'center',
      color: '#999',
      fontSize: '14px'
    }
  };

  const statCards = [
    { label: 'Tổng Users', value: stats.totalUsers.toLocaleString(), icon: '👥', color: '#3498db', sub: `+${stats.newUsersToday} hôm nay` },
    { label: 'Tổng Shops', value: stats.totalShops.toLocaleString(), icon: '🏪', color: '#e74c3c', sub: `${stats.pendingShops} chờ duyệt` },
    { label: 'Tổng Đơn hàng', value: stats.totalOrders.toLocaleString(), icon: '📦', color: '#2ecc71', sub: `+${stats.newOrdersToday} hôm nay` },
    { label: 'Doanh thu', value: formatCurrency(stats.totalRevenue) + 'đ', icon: '💰', color: '#f39c12', sub: 'Tổng doanh thu' }
  ];

  const quickActions = [
    { icon: '👥', label: 'Quản lý Users', path: '/admin/users' },
    { icon: '🏪', label: 'Duyệt Shop', path: '/admin/shops' },
    { icon: '⚠️', label: 'Review báo cáo', path: '/admin/reviews', badge: stats.reportedReviews },
    { icon: '📊', label: 'Báo cáo', path: '/admin/reports' }
  ];

  return (
    <div>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div>
          <div style={styles.welcomeText}>Chào mừng trở lại, Admin! 👋</div>
          <div style={styles.welcomeSubtext}>
            Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>Đang hoạt động</div>
          <div style={{ fontSize: '24px' }}>🟢</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={adminStyles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} style={adminStyles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20' }}>
              {stat.icon}
            </div>
            <div>
              <div style={adminStyles.statLabel}>{stat.label}</div>
              <div style={adminStyles.statValue}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={styles.sectionTitle}>Thao tác nhanh</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              style={styles.quickActionBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e8e9ea';
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#ddd';
              }}
            >
              <span style={{ fontSize: '24px' }}>{action.icon}</span>
              <span style={{ fontWeight: '500' }}>{action.label}</span>
              {action.badge && (
                <span style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  marginLeft: 'auto'
                }}>
                  {action.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.gridContainer}>
        {/* Left - Activities */}
        <div>
          <div style={adminStyles.card}>
            <h3 style={styles.sectionTitle}>Hoạt động gần đây</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentActivities.map(activity => (
                <div key={activity.id} style={styles.activityItem}>
                  <div style={styles.activityIcon}>{activity.icon}</div>
                  <div style={styles.activityContent}>
                    <div style={styles.activityAction}>{activity.action}</div>
                    <div style={styles.activityDetail}>{activity.detail}</div>
                  </div>
                  <div style={styles.activityTime}>{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Top Shops */}
        <div>
          <div style={adminStyles.card}>
            <h3 style={styles.sectionTitle}>Top Shops tháng này</h3>
            {topShops.map((shop, index) => (
              <div key={shop.id} style={styles.shopRow}>
                <div style={{
                  ...styles.shopRank,
                  backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e0e0e0',
                  color: index < 3 ? 'white' : '#666'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{shop.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {shop.orders} đơn • ⭐ {shop.rating}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#e74c3c' }}>
                    {formatCurrency(shop.revenue)}đ
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Approvals */}
          <div style={{ ...adminStyles.card, marginTop: '24px' }}>
            <h3 style={styles.sectionTitle}>Chờ xử lý</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/admin/shops" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#856404'
              }}>
                <span>🏪 Shop chờ duyệt</span>
                <span style={{ fontWeight: '700' }}>{stats.pendingShops}</span>
              </Link>
              <Link to="/admin/reviews" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f8d7da',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#721c24'
              }}>
                <span>⚠️ Review bị báo cáo</span>
                <span style={{ fontWeight: '700' }}>{stats.reportedReviews}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
