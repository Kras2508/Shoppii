import React from 'react';

const ProfileStatistics = ({ stats, statistics, orders, styles, formatPrice }) => {
  // Use statistics from API (Part 2 functions) or calculate fallback
  const apiStats = statistics || {};
  
  const calculatedStats = {
    avgOrderValue: apiStats.avg_order_value || 0,
    totalItemsPurchased: apiStats.total_items_purchased || 0,
    deliveredCount: apiStats.delivered_count || stats.delivered_orders || 0,
    processingCount: apiStats.processing_count || orders.filter(o => o.status === 'Processing').length,
    shippedCount: apiStats.shipped_count || orders.filter(o => o.status === 'Shipped').length,
    cancelledCount: apiStats.cancelled_count || orders.filter(o => o.status === 'Cancelled').length
  };

  // Monthly spending from API or empty
  const monthlySpending = apiStats.monthly_spending?.length > 0 
    ? apiStats.monthly_spending 
    : [];

  const maxSpending = monthlySpending.length > 0 
    ? Math.max(...monthlySpending.map(m => m.amount)) 
    : 1;

  // Format month label
  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    return `Tháng ${parseInt(month)}/${year}`;
  };

  return (
    <div>
      {/* Overview Stats */}
      <div style={styles.statsSection}>
        <h3 style={styles.statsSectionTitle}>📊 General Overview</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statsDetailCard}>
            <div style={styles.statsDetailLabel}>Total Spent</div>
            <div style={styles.statsDetailValue}>{formatPrice(stats.total_spent)}</div>
            <div style={styles.statsDetailSubtext}>fn_get_customer_total_spent</div>
          </div>
          <div style={styles.statsDetailCard}>
            <div style={styles.statsDetailLabel}>Average Order Value</div>
            <div style={styles.statsDetailValue}>{formatPrice(calculatedStats.avgOrderValue)}</div>
            <div style={styles.statsDetailSubtext}>AVG(fn_calculate_order_total)</div>
          </div>
          <div style={styles.statsDetailCard}>
            <div style={styles.statsDetailLabel}>Total Items Purchased</div>
            <div style={styles.statsDetailValue}>{calculatedStats.totalItemsPurchased}</div>
            <div style={styles.statsDetailSubtext}>From non-cancelled orders</div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div style={styles.statsSection}>
        <h3 style={styles.statsSectionTitle}>📦 Order Status Breakdown</h3>
        <div style={styles.statsGrid}>
          <div style={{
            ...styles.statsDetailCard,
            borderLeft: '4px solid #FFC107'
          }}>
            <div style={styles.statsDetailLabel}>Processing</div>
            <div style={styles.statsDetailValue}>{calculatedStats.processingCount}</div>
          </div>
          <div style={{
            ...styles.statsDetailCard,
            borderLeft: '4px solid #2196F3'
          }}>
            <div style={styles.statsDetailLabel}>Shipped</div>
            <div style={styles.statsDetailValue}>{calculatedStats.shippedCount}</div>
          </div>
          <div style={{
            ...styles.statsDetailCard,
            borderLeft: '4px solid #4CAF50'
          }}>
            <div style={styles.statsDetailLabel}>Delivered</div>
            <div style={styles.statsDetailValue}>{calculatedStats.deliveredCount}</div>
          </div>
        </div>
      </div>

      {/* Monthly Spending Chart */}
      {monthlySpending.length > 0 && (
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>💹 Monthly Spending (fn_calculate_order_total)</h3>
          <div style={styles.spendingBreakdown}>
            {monthlySpending.map((item, index) => (
              <div key={index} style={styles.spendingItem}>
                <span style={styles.spendingLabel}>{formatMonth(item.month)}</span>
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
      )}

      {monthlySpending.length === 0 && (
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>💹 Monthly Spending</h3>
          <p style={{ textAlign: 'center', color: '#999' }}>No spending data available</p>
        </div>
      )}
    </div>
  );
};

export default ProfileStatistics;
