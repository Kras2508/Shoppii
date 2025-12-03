import React from 'react';

const OrderInfo = ({ order, styles, formatPrice }) => {
  return (
    <div style={styles.infoSection}>
      <h3 style={styles.infoTitle}>Thông Tin Đơn Hàng</h3>
      
      <div style={styles.infoGrid}>
        {/* Shipping Info */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>📍</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Địa chỉ giao hàng</div>
            <div style={styles.infoCardValue}>{order.shipping_address}</div>
          </div>
        </div>
        
        {/* Shipping Method */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>🚚</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Phương thức vận chuyển</div>
            <div style={styles.infoCardValue}>{order.shipping?.name}</div>
            <div style={styles.infoCardSub}>
              Dự kiến: {order.shipping?.estimated_days} ngày
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>💳</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Phương thức thanh toán</div>
            <div style={styles.infoCardValue}>{order.payment_method}</div>
          </div>
        </div>
        
        {/* Order Date */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardIcon}>📅</div>
          <div style={styles.infoCardContent}>
            <div style={styles.infoCardLabel}>Ngày đặt hàng</div>
            <div style={styles.infoCardValue}>
              {new Date(order.order_date).toLocaleDateString('vi-VN', {
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
