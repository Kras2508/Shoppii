import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = ({ order, styles, formatPrice }) => {
  return (
    <div style={styles.successSection}>
      <div style={styles.successIcon}>✓</div>
      <h2 style={styles.successTitle}>Order Successful!</h2>
      <p style={styles.successMessage}>
        Thank you for your purchase! Your order has been successfully placed and is being processed.
      </p>
      <div style={styles.orderIdBox}>
        <span style={styles.orderIdLabel}>Order ID:</span>
        <span style={styles.orderIdValue}>#{order.order_id}</span>
      </div>
    </div>
  );
};

export default OrderSuccess;
