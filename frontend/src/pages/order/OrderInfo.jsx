import React from 'react';

const OrderInfo = ({ order, styles, formatPrice }) => {
  return (
    <div style={styles.infoSection}>
      <h3 style={styles.infoTitle}>Order details</h3>
      
      <div style={styles.infoGrid}>
        {/* Shipping Info */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>📍</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Shipping address</div>
            <div style={styles.infoCardValue}>{order.shipping_address}</div>
          </div>
        </div>
        
        {/* Shipping Method */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>🚚</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Shipping method</div>
            <div style={styles.infoCardValue}>{order.shipping?.name}</div>
            <div style={styles.infoCardSub}>
              Estimated: {order.shipping?.estimated_days} days
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>💳</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Payment method</div>
            <div style={styles.infoCardValue}>{order.payment_method}</div>
          </div>
        </div>
        
        {/* Order Date */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>📅</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Order date</div>
            <div style={styles.infoCardValue}>
              {new Date(order.order_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
