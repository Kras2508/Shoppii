import React from 'react';

const OrderDetailTimeline = ({ status, styles, createdAt }) => {
  const steps = [
    {
      key: 'Pending',
      label: 'Successfully placed',
      icon: '📝',
      desc: 'Order has been placed'
    },
    {
      key: 'Processing',
      label: 'Processing',
      icon: '📦',
      desc: 'Shop is preparing the order'
    },
    {
      key: 'Shipped',
      label: 'Shipping',
      icon: '🚚',
      desc: 'Order is being shipped'
    },
    {
      key: 'Delivered',
      label: 'Delivered',
      icon: '✅',
      desc: 'Order has been delivered'
    }
  ];

  const getStatusIndex = () => {
    if (status === 'Cancelled') return -1;
    const statusMap = {
      'Pending': 0,
      'Processing': 1,
      'Shipped': 2,
      'Delivered': 3
    };
    return statusMap[status] ?? 1;
  };

  const currentIndex = getStatusIndex();

  const formatDate = (dateString, addDays = 0) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + addDays);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'Cancelled') {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>❌</div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#dc3545' }}>
          This order has been cancelled
        </div>
        <div style={{ color: '#666', marginTop: '8px' }}>
          This order has been cancelled by you or the seller
        </div>
      </div>
    );
  }

  return (
    <div style={styles.timeline}>
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={step.key}
            style={{
              ...styles.timelineItem,
              ...(isActive ? styles.timelineItemActive : {}),
              ...(isLast ? styles.timelineItemLast : {})
            }}
          >
            <div
              style={{
                ...styles.timelineDot,
                ...(isActive ? styles.timelineDotActive : {}),
                ...(isCurrent ? styles.timelineDotCurrent : {})
              }}
            />
            <div style={styles.timelineContent}>
              <div style={{
                ...styles.timelineTitle,
                color: isActive ? '#1F241F' : '#999'
              }}>
                {step.icon} {step.label}
              </div>
              {isActive && (
                <>
                  <div style={styles.timelineTime}>
                    {formatDate(createdAt, index)}
                  </div>
                  <div style={styles.timelineDesc}>
                    {step.desc}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderDetailTimeline;
