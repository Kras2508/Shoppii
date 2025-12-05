import React from 'react';

const OrderTimeline = ({ order, styles }) => {
  // Order status theo database: Processing, Shipped, Delivered, Cancelled
  const statusSteps = [
    { key: 'Processing', label: 'Processing', icon: '📦', description: 'Order is being prepared' },
    { key: 'Shipped', label: 'Shipping', icon: '🚚', description: 'Order is being shipped' },
    { key: 'Delivered', label: 'Delivered', icon: '✅', description: 'Order has been delivered' }
  ];

  const getStatusIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return statusSteps.findIndex(s => s.key === status);
  };

  const currentIndex = getStatusIndex(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div style={styles.timelineSection}>
      <h3 style={styles.timelineTitle}>Order Status</h3>
      
      {isCancelled ? (
        <div style={styles.cancelledBox}>
          <span style={styles.cancelledIcon}>❌</span>
          <div>
            <div style={styles.cancelledTitle}>This order has been cancelled</div>
            <div style={styles.cancelledDate}>
              {new Date(order.updated_at).toLocaleString('vi-VN')}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.timeline}>
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.key} style={styles.timelineStep}>
                {/* Connector Line */}
                {index > 0 && (
                  <div style={{
                    ...styles.timelineConnector,
                    backgroundColor: index <= currentIndex ? '#647A67' : '#e0e0e0'
                  }} />
                )}
                
                {/* Step Circle */}
                <div style={{
                  ...styles.timelineCircle,
                  backgroundColor: isCompleted ? '#647A67' : 'white',
                  borderColor: isCompleted ? '#647A67' : '#e0e0e0',
                  transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(100, 122, 103, 0.2)' : 'none'
                }}>
                  <span style={{
                    fontSize: '20px',
                    filter: isCompleted ? 'none' : 'grayscale(100%)',
                    opacity: isCompleted ? 1 : 0.5
                  }}>
                    {step.icon}
                  </span>
                </div>
                
                {/* Step Content */}
                <div style={styles.timelineContent}>
                  <div style={{
                    ...styles.timelineLabel,
                    color: isCompleted ? '#1F241F' : '#999',
                    fontWeight: isCurrent ? '600' : '400'
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    ...styles.timelineDesc,
                    color: isCompleted ? '#758173' : '#ccc'
                  }}>
                    {step.description}
                  </div>
                  {isCurrent && order.status !== 'Delivered' && (
                    <div style={styles.currentBadge}>Now</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
