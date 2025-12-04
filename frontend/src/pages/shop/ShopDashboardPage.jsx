import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { shopService } from '../../api/shopService';
import createPrivateClient from '../../clients/private.client';

const ShopDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [shopData, setShopData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await shopService.getShopDashboard(privateClient);
        if (response.data?.data) {
          const data = response.data.data;
          setShopData({
            shop_id: data.shop?.shop_id,
            shop_name: data.shop?.shop_name || `Shop của ${user?.full_name}`,
            rating: data.shop?.rating || 0,
            followers: data.shop?.followers || 0,
            totalProducts: data.stats?.products?.total_products || 0,
            totalOrders: data.stats?.orders?.total_orders || 0,
            totalRevenue: data.stats?.total_revenue || 0,
            pendingOrders: data.stats?.orders?.processing || 0,
            processingOrders: data.stats?.orders?.shipped || 0,
            completedOrders: data.stats?.orders?.delivered || 0
          });
          setRecentOrders(data.recent_orders || []);
          setTopProducts(data.top_products || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isAuthenticated, navigate, token]);

  const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN') + 'đ';

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

  if (loading) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !shopData) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
          <p>{error || 'Không tìm thấy dữ liệu shop'}</p>
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
                    <td style={shopStyles.td}>{order.customer_name || 'Khách hàng'}</td>
                    <td style={shopStyles.td}>{formatPrice(order.total_amount)}</td>
                    <td style={shopStyles.td}>
                      <span style={getStatusStyle(order.status)}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ ...shopStyles.td, textAlign: 'center', color: '#999' }}>
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Top Products */}
          <div style={shopStyles.card}>
            <h2 style={shopStyles.cardTitle}>🏆 Sản phẩm bán chạy</h2>
            
            {topProducts.map((product, index) => (
              <div key={product.product_id} style={{
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
                    {product.product_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Đã bán: {product.total_sold || 0}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#647A67' }}>
                  {formatPrice(product.total_revenue || 0)}
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
