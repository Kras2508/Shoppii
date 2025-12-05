import React from 'react';

const OrderDetailSummary = ({ order, styles, formatPrice }) => {
  const subtotal = order.subtotal || order.items?.reduce((sum, item) => {
    const price = item.price_at_purchase ?? item.price ?? 0;
    return sum + (price * (item.quantity || 1));
  }, 0) || 0;

  const shippingFee = order.shipping_fee || order.shipping?.fee || 0;
  
  // Calculate discount based on discount_type and discount_value
  let discount = 0;
  if (order.discount_value && order.discount_type) {
    if (order.discount_type === 'Percentage') {
      discount = (subtotal * order.discount_value) / 100;
    } else if (order.discount_type === 'Amount') {
      discount = order.discount_value * 1000;
    } else {
      discount = order.discount_value;
    }
  }
  
  // Use calculated_total from backend (fn_calculate_order_total) or fallback
  const total = order.calculated_total || order.total_price || order.total_amount || (subtotal + shippingFee - discount);

  return (
    <div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Subtotal</span>
        <span style={styles.summaryValue}>{formatPrice(subtotal)}</span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Shipping Fee</span>
        <span style={styles.summaryValue}>{formatPrice(shippingFee)}</span>
      </div>
      {discount > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>
            Discount {order.voucher_code ? `(${order.voucher_code})` : ''}
          </span>
          <span style={{ ...styles.summaryValue, color: '#647A67' }}>
            -{formatPrice(discount)}
          </span>
        </div>
      )}
      <div style={styles.summaryTotal}>
        <span style={styles.totalLabel}>Total</span>
        <span style={styles.totalValue}>{formatPrice(total)}</span>
      </div>
    </div>
  );
};

export default OrderDetailSummary;
