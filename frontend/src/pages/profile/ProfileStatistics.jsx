import React from 'react';

const ProfileStatistics = ({ stats, orders, styles, formatPrice }) => {
  // Calculate statistics based on fn_get_customer_total_spent and fn_calculate_order_total
  const calculateStats = () => {
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const processingOrders = orders.filter(o => o.status === 'Processing');
    const shippedOrders = orders.filter(o => o.status === 'Shipped');
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled');

    // Calculate average order value (like fn_calculate_order_total average)
    const avgOrderValue = deliveredOrders.length > 0
      ? deliveredOrders.reduce((sum, o) => sum + o.total_amount, 0) / deliveredOrders.length
      : 0;

    // Total items purchased
    const totalItemsPurchased = deliveredOrders.reduce((sum, o) => 
      sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Most purchased category
    const categoryCount = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.category_name || 'Khác';
        categoryCount[cat] = (categoryCount[cat] || 0) + item.quantity;
      });
    });
    const topCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      avgOrderValue,
      totalItemsPurchased,
      topCategory: topCategory ? topCategory[0] : 'Chưa có',
      deliveredCount: deliveredOrders.length,
      processingCount: processingOrders.length,
      shippedCount: shippedOrders.length,
      cancelledCount: cancelledOrders.length
    };
  };

  const calculatedStats = calculateStats();

  // Spending by month (mock data for visualization)
  const monthlySpending = [
    { month: 'Tháng 7', amount: 1250000 },
    { month: 'Tháng 8', amount: 890000 },
    { month: 'Tháng 9', amount: 2100000 },
    { month: 'Tháng 10', amount: 1560000 },
    { month: 'Tháng 11', amount: 3200000 },
    { month: 'Tháng 12', amount: stats.total_spent * 0.3 }
  ];

  const maxSpending = Math.max(...monthlySpending.map(m => m.amount));

  return (
    <div>
      {/* Overview Stats */}
      <div style={styles.statsSection}>
        <h3 style={styles.statsSectionTitle}>📊 Tổng quan chi tiêu</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statsDetailCard}>
            <div style={styles.statsDetailLabel}>Tổng chi tiêu (fn_get_customer_total_spent)</div>
            <div style={styles.statsDetailValue}>{formatPrice(stats.total_spent)}</div>
            <div style={styles.statsDetailSubtext}>Chỉ tính đơn hàng thành công</div>
          </div>
          <div style={styles.statsDetailCard}>
            <div style={styles.statsDetailLabel}>Giá trị đơn trung bình</div>
            <div style={styles.statsDetailValue}>{formatPrice(calculatedStats.avgOrderValue)}</div>
            <div style={styles.statsDetailSubtext}>fn_calculate_order_total / số đơn</div>
          </div>
          <div style={styles.statsDetailCard}>
            <div style={styles.statsDetailLabel}>Tổng sản phẩm đã mua</div>
            <div style={styles.statsDetailValue}>{calculatedStats.totalItemsPurchased}</div>
            <div style={styles.statsDetailSubtext}>Từ các đơn hàng đã giao</div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div style={styles.statsSection}>
        <h3 style={styles.statsSectionTitle}>📦 Thống kê đơn hàng</h3>
        <div style={styles.statsGrid}>
          <div style={{
            ...styles.statsDetailCard,
            borderLeft: '4px solid #FFC107'
          }}>
            <div style={styles.statsDetailLabel}>Đang xử lý</div>
            <div style={styles.statsDetailValue}>{calculatedStats.processingCount}</div>
          </div>
          <div style={{
            ...styles.statsDetailCard,
            borderLeft: '4px solid #2196F3'
          }}>
            <div style={styles.statsDetailLabel}>Đang giao</div>
            <div style={styles.statsDetailValue}>{calculatedStats.shippedCount}</div>
          </div>
          <div style={{
            ...styles.statsDetailCard,
            borderLeft: '4px solid #4CAF50'
          }}>
            <div style={styles.statsDetailLabel}>Đã giao</div>
            <div style={styles.statsDetailValue}>{calculatedStats.deliveredCount}</div>
          </div>
        </div>
      </div>

      {/* Monthly Spending Chart */}
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>💹 Chi tiêu theo tháng</h3>
        <div style={styles.spendingBreakdown}>
          {monthlySpending.map((item, index) => (
            <div key={index} style={styles.spendingItem}>
              <span style={styles.spendingLabel}>{item.month}</span>
              <div style={styles.spendingBar}>
                <div 
                  style={{
                    ...styles.spendingFill,
                    width: `${(item.amount / maxSpending) * 100}%`,
                    backgroundColor: index === monthlySpending.length - 1 ? '#e53935' : '#647A67'
                  }}
                />
              </div>
              <span style={styles.spendingValue}>{formatPrice(item.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileStatistics;
