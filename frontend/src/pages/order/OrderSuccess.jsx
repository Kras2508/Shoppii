import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = ({ order, styles, formatPrice }) => {
  return (
    <div style={styles.successSection}>
      <div style={styles.successIcon}>✓</div>
      <h2 style={styles.successTitle}>Đặt Hàng Thành Công!</h2>
      <p style={styles.successMessage}>
        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
      </p>
      <div style={styles.orderIdBox}>
        <span style={styles.orderIdLabel}>Mã đơn hàng:</span>
        <span style={styles.orderIdValue}>#{order.order_id}</span>
      </div>
    </div>
  );
};

export default OrderSuccess;
