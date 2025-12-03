import React from 'react';

const OrderDetailSummary = ({ order, styles, formatPrice }) => {
  const subtotal = order.subtotal || order.items?.reduce((sum, item) => {
    const price = item.price_at_purchase ?? item.price ?? 0;
    return sum + (price * (item.quantity || 1));
  }, 0) || 0;

  const shippingFee = order.shipping_fee || order.shipping?.fee || 0;
  const discount = order.discount || order.voucher?.discount_amount || 0;
  const total = order.total_price || order.total_amount || (subtotal + shippingFee - discount);

  return (
    <div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Tạm tính</span>
        <span style={styles.summaryValue}>{formatPrice(subtotal)}</span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Phí vận chuyển</span>
        <span style={styles.summaryValue}>{formatPrice(shippingFee)}</span>
      </div>
      {discount > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>
            Giảm giá {order.voucher?.code ? `(${order.voucher.code})` : ''}
          </span>
          <span style={{ ...styles.summaryValue, color: '#647A67' }}>
            -{formatPrice(discount)}
          </span>
        </div>
      )}
      <div style={styles.summaryTotal}>
        <span style={styles.totalLabel}>Tổng cộng</span>
        <span style={styles.totalValue}>{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default OrderDetailSummary;
