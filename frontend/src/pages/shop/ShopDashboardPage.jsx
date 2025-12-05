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
        console.log('📊 Shop Dashboard Data:', response.data?.data);
        
        if (response.data?.data) {
          const data = response.data.data;
          const shop = data.shop;
          const stats = data.stats;
          
          setShopData({
            shop_id: shop?.shop_id,
            shop_name: shop?.shop_name || `Shop ${user?.full_name}`,
            rating: shop?.rating || 0,
            followers: shop?.followers || 0,
            totalProducts: stats?.products?.total_products || 0,
            totalOrders: stats?.orders?.total_orders || 0,
            totalRevenue: stats?.total_revenue || 0,
            pendingOrders: stats?.orders?.processing || 0,
            processingOrders: stats?.orders?.shipped || 0,
            completedOrders: stats?.orders?.delivered || 0
          });
          
          // Map recent orders properly
          const mappedOrders = (data.recent_orders || []).map(order => ({
            order_id: order.order_id,
            customer_name: order.customer_name || 'Customer',
            total_amount: parseFloat(order.total_amount) || 0,
            status: order.status || 'Processing',
            created_at: order.created_at
          }));
          setRecentOrders(mappedOrders);
          
          // Map top products properly
          const mappedProducts = (data.top_products || []).map(product => ({
            product_id: product.product_id,
            product_name: product.product_name,
            image: product.image,
            total_sold: product.total_sold || 0,
            total_revenue: product.total_revenue || 0
          }));
          setTopProducts(mappedProducts);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError('Không thể tải dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isAuthenticated, navigate, token, user]);

  const formatPrice = (price) => Number(price || 0).toLocaleString('vi-VN') + ' VND';

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
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !shopData) {
    return (
      <div style={shopStyles.page}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>❌</div>
          <p>{error || 'Shop data not found'}</p>
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
            <h1 style={shopStyles.pageTitle}>🏬 {shopData.shop_name}</h1>
          </div>
          <Link to="/shop/products/new" style={{ textDecoration: 'none' }}>
            <button style={shopStyles.primaryBtn}>
              Add New Product
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={shopStyles.statsGrid}>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>📦</div>
            <div style={shopStyles.statValue}>{shopData.totalProducts}</div>
            <div style={shopStyles.statLabel}>Products</div>
          </div>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>🛒</div>
            <div style={shopStyles.statValue}>{shopData.totalOrders}</div>
            <div style={shopStyles.statLabel}>Orders</div>
          </div>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>⏳</div>
            <div style={shopStyles.statValue}>{shopData.pendingOrders}</div>
            <div style={shopStyles.statLabel}>Pending</div>
          </div>
          <div style={shopStyles.statCard}>
            <div style={shopStyles.statIcon}>💰</div>
            <div style={shopStyles.statValue}>{formatPrice(shopData.totalRevenue)}</div>
            <div style={shopStyles.statLabel}>Revenue</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Recent Orders */}
          <div style={shopStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ ...shopStyles.cardTitle, marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                📋 Recent Orders
              </h2>
              <Link to="/shop/orders" style={{ color: '#647A67', fontSize: '14px' }}>
                View All →
              </Link>
            </div>
            
            <table style={shopStyles.table}>
              <thead style={shopStyles.tableHeader}>
                <tr>
                  <th style={shopStyles.th}>Order ID</th>
                  <th style={shopStyles.th}>Customer</th>
                  <th style={shopStyles.th}>Total Amount</th>
                  <th style={shopStyles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.order_id}>
                    <td style={shopStyles.td}>#{order.order_id}</td>
                    <td style={shopStyles.td}>{order.customer_name || 'Customer'}</td>
                    <td style={shopStyles.td}>{formatPrice(order.total_amount || 0)}</td>
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
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Top Products */}
          <div style={shopStyles.card}>
            <h2 style={shopStyles.cardTitle}>🏆 Top Selling Products</h2>
            
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
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
                      Sold: {product.total_sold}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#647A67' }}>
                    {formatPrice(product.total_revenue)}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                Chưa có sản phẩm bán được
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
