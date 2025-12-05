import React from 'react';

const ProfileStats = ({ stats, styles, formatPrice }) => {
  const statItems = [
    {
      icon: '🛒',
      value: stats.total_order,
      label: 'Total Orders'
    },
    {
      icon: '💰',
      value: formatPrice(stats.total_spent),
      label: 'Total Spent',
      isPrice: true
    },
    {
      icon: '📦',
      value: stats.delivered_orders,
      label: 'Delivered'
    },
    {
      icon: '⭐',
      value: stats.total_reviews,
      label: 'Reviews'
    }
  ];

  return (
    <div style={styles.statsContainer}>
      {statItems.map((stat, index) => (
        <div key={index} style={styles.statCard}>
          <div style={styles.statIcon}>{stat.icon}</div>
          <div style={{
            ...styles.statValue,
            fontSize: stat.isPrice ? '22px' : '28px'
          }}>
            {stat.value}
          </div>
          <div style={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
