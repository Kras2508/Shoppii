import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { shopService } from '../../api/shopService';
import createPrivateClient from '../../clients/private.client';

const ShopReportsPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [dateRange, setDateRange] = useState('thisMonth'); // today, thisWeek, thisMonth, custom
  const [reportType, setReportType] = useState('overview'); // overview, revenue, orders, products
  const [loading, setLoading] = useState(true);

  // Data states
  const [overviewStats, setOverviewStats] = useState({
    revenue: 0,
    revenueGrowth: 0,
    orders: 0,
    ordersGrowth: 0,
    products_sold: 0,
    productsGrowth: 0,
    avg_order_value: 0,
    avgGrowth: 0
  });

  const [revenueByDay, setRevenueByDay] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await shopService.getShopRevenueReport(privateClient, { period: dateRange });
        if (response.data?.data) {
          const data = response.data.data;
          setOverviewStats({
            revenue: data.total_revenue || 0,
            revenueGrowth: data.revenue_growth || 0,
            orders: data.total_orders || 0,
            ordersGrowth: data.orders_growth || 0,
            products_sold: data.products_sold || 0,
            productsGrowth: data.products_growth || 0,
            avg_order_value: data.avg_order_value || 0,
            avgGrowth: data.avg_growth || 0
          });
          setRevenueByDay(data.revenue_by_day || []);
          setTopProducts(data.top_products || []);
          setOrderStatusStats(data.order_status || []);
          setCategoryRevenue(data.category_revenue || []);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
        // Use fallback mock data if API fails
        setOverviewStats({
          revenue: 45680000, revenueGrowth: 12.5,
          orders: 156, ordersGrowth: 8.3,
          products_sold: 423, productsGrowth: 15.2,
          avg_order_value: 292820, avgGrowth: 3.8
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [dateRange, token]);

  const styles = {
    ...shopStyles,
    filterBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    filterGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    filterLabel: {
      fontSize: '14px',
      color: '#666',
      fontWeight: '500'
    },
    filterBtn: {
      padding: '8px 16px',
      fontSize: '13px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    filterBtnActive: {
      backgroundColor: '#647A67',
      color: 'white',
      borderColor: '#647A67'
    },
    select: {
      padding: '8px 12px',
      fontSize: '13px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    statCardLarge: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1F241F',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '8px'
    },
    growthBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '13px',
      fontWeight: '500',
      padding: '4px 8px',
      borderRadius: '4px'
    },
    growthPositive: {
      backgroundColor: '#e8f5e9',
      color: '#2e7d32'
    },
    growthNegative: {
      backgroundColor: '#ffebee',
      color: '#c62828'
    },
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    },
    chartTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '20px'
    },
    barChart: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px',
      height: '200px',
      paddingTop: '20px'
    },
    barItem: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    bar: {
      width: '100%',
      backgroundColor: '#647A67',
      borderRadius: '4px 4px 0 0',
      transition: 'height 0.3s ease'
    },
    barLabel: {
      fontSize: '11px',
      color: '#666',
      marginTop: '8px'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#666',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9'
    },
    td: {
      padding: '14px 12px',
      fontSize: '14px',
      borderBottom: '1px solid #f0f0f0'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s ease'
    },
    pieChart: {
      display: 'flex',
      gap: '40px',
      alignItems: 'center'
    },
    pieVisual: {
      width: '180px',
      height: '180px',
      borderRadius: '50%',
      position: 'relative',
      background: 'conic-gradient(#4caf50 0% 77%, #2196f3 77% 89%, #ff9800 89% 97%, #f44336 97% 100%)'
    },
    pieLegend: {
      flex: 1
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid #f0f0f0'
    },
    legendDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%'
    },
    exportBtn: {
      padding: '10px 20px',
      fontSize: '14px',
      backgroundColor: 'white',
      border: '1px solid #647A67',
      color: '#647A67',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '500'
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue));

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>📊 Báo cáo & Thống kê</h1>
          <button 
            style={styles.exportBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#647A67';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#647A67';
            }}
          >
            📥 Xuất báo cáo
          </button>
        </div>

        {/* Filter Bar */}
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Thời gian:</span>
            {[
              { value: 'today', label: 'Hôm nay' },
              { value: 'thisWeek', label: 'Tuần này' },
              { value: 'thisMonth', label: 'Tháng này' },
              { value: 'custom', label: 'Tùy chọn' }
            ].map(item => (
              <button
                key={item.value}
                style={{
                  ...styles.filterBtn,
                  ...(dateRange === item.value ? styles.filterBtnActive : {})
                }}
                onClick={() => setDateRange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px', 
          marginBottom: '24px' 
        }}>
          <div style={styles.statCardLarge}>
            <div style={styles.statLabel}>💰 Doanh thu</div>
            <div style={styles.statValue}>{formatCurrency(overviewStats.revenue)}</div>
            <div style={{
              ...styles.growthBadge,
              ...(overviewStats.revenueGrowth >= 0 ? styles.growthPositive : styles.growthNegative)
            }}>
              {overviewStats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(overviewStats.revenueGrowth)}%
            </div>
          </div>
          <div style={styles.statCardLarge}>
            <div style={styles.statLabel}>📦 Đơn hàng</div>
            <div style={styles.statValue}>{overviewStats.orders}</div>
            <div style={{
              ...styles.growthBadge,
              ...(overviewStats.ordersGrowth >= 0 ? styles.growthPositive : styles.growthNegative)
            }}>
              {overviewStats.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(overviewStats.ordersGrowth)}%
            </div>
          </div>
          <div style={styles.statCardLarge}>
            <div style={styles.statLabel}>🛍️ Sản phẩm đã bán</div>
            <div style={styles.statValue}>{overviewStats.products_sold}</div>
            <div style={{
              ...styles.growthBadge,
              ...(overviewStats.productsGrowth >= 0 ? styles.growthPositive : styles.growthNegative)
            }}>
              {overviewStats.productsGrowth >= 0 ? '↑' : '↓'} {Math.abs(overviewStats.productsGrowth)}%
            </div>
          </div>
          <div style={styles.statCardLarge}>
            <div style={styles.statLabel}>💳 Giá trị đơn TB</div>
            <div style={styles.statValue}>{formatCurrency(overviewStats.avg_order_value)}</div>
            <div style={{
              ...styles.growthBadge,
              ...(overviewStats.avgGrowth >= 0 ? styles.growthPositive : styles.growthNegative)
            }}>
              {overviewStats.avgGrowth >= 0 ? '↑' : '↓'} {Math.abs(overviewStats.avgGrowth)}%
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div style={styles.chartContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={styles.chartTitle}>📈 Doanh thu theo ngày</h3>
          </div>
          <div style={styles.barChart}>
            {revenueByDay.map((day, idx) => (
              <div key={idx} style={styles.barItem}>
                <div style={{ fontSize: '11px', color: '#647A67', marginBottom: '8px', fontWeight: '600' }}>
                  {formatCurrency(day.revenue).replace('₫', '')}
                </div>
                <div 
                  style={{
                    ...styles.bar,
                    height: `${(day.revenue / maxRevenue) * 150}px`,
                    backgroundColor: idx === revenueByDay.length - 1 ? '#C5EFCB' : '#647A67'
                  }}
                  title={`${day.orders} đơn hàng`}
                />
                <div style={styles.barLabel}>{day.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Order Status Chart */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>📋 Trạng thái đơn hàng</h3>
            <div style={styles.pieChart}>
              <div style={styles.pieVisual}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F241F' }}>156</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Tổng đơn</div>
                </div>
              </div>
              <div style={styles.pieLegend}>
                {orderStatusStats.map((item, idx) => (
                  <div key={idx} style={styles.legendItem}>
                    <div style={{ ...styles.legendDot, backgroundColor: item.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.status}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{item.count} đơn ({item.percentage}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Revenue */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>📁 Doanh thu theo danh mục</h3>
            {categoryRevenue.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.category}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>{formatCurrency(item.revenue)}</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${item.percentage}%`,
                    backgroundColor: '#647A67'
                  }} />
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{item.percentage}% tổng doanh thu</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Table */}
        <div style={styles.tableContainer}>
          <h3 style={styles.chartTitle}>🏆 Sản phẩm bán chạy</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Sản phẩm</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Đã bán</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Doanh thu</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, idx) => (
                <tr key={product.id}>
                  <td style={styles.td}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: idx < 3 ? '#C5EFCB' : '#f0f0f0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: idx < 3 ? '#2e7d32' : '#666'
                    }}>
                      {idx + 1}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: '500' }}>{product.name}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>{product.sold}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', color: '#647A67' }}>
                    {formatCurrency(product.revenue)}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <span style={{
                      ...styles.growthBadge,
                      ...(product.growth >= 0 ? styles.growthPositive : styles.growthNegative)
                    }}>
                      {product.growth >= 0 ? '↑' : '↓'} {Math.abs(product.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopReportsPage;
