import React from 'react';

const CheckoutSummary = ({
  checkoutItems,
  subtotal,
  shippingFee,
  discount,
  totalAmount,
  selectedVoucher,
  onPlaceOrder,
  styles,
  formatPrice
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span>🧾</span> Chi Tiết Thanh Toán
      </h2>
      
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Tạm tính ({checkoutItems.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
        <span style={styles.summaryValue}>{formatPrice(subtotal)}</span>
      </div>
      
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Phí vận chuyển</span>
        <span style={styles.summaryValue}>{formatPrice(shippingFee)}</span>
      </div>
      
      {discount > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Giảm giá voucher</span>
          <span style={styles.summaryDiscount}>-{formatPrice(discount)}</span>
        </div>
      )}
      
      <div style={styles.summaryTotal}>
        <span style={styles.totalLabel}>Tổng thanh toán</span>
        <span style={styles.totalValue}>{formatPrice(totalAmount)}</span>
      </div>

      <button
        style={styles.placeOrderBtn}
        onClick={onPlaceOrder}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
      >
        Đặt Hàng
      </button>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#758173', textAlign: 'center' }}>
        Nhấn "Đặt Hàng" đồng nghĩa với việc bạn đồng ý tuân theo 
        <a href="#" style={{ color: '#647A67' }}> Điều khoản ShopMart</a>
      </div>
    </div>
  );
};

export default CheckoutSummary;
