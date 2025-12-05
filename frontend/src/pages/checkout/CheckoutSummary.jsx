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
        <span>🧾</span> Payment details
      </h2>
      
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Subtotal ({checkoutItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
        <span style={styles.summaryValue}>{formatPrice(subtotal)}</span>
      </div>
      
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Shipping fee</span>
        <span style={styles.summaryValue}>{formatPrice(shippingFee)}</span>
      </div>
      
      {discount > 0 && (
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Voucher discount</span>
          <span style={styles.summaryDiscount}>-{formatPrice(discount)}</span>
        </div>
      )}
      
      <div style={styles.summaryTotal}>
        <span style={styles.totalLabel}>Total amount</span>
        <span style={styles.totalValue}>{formatPrice(totalAmount)}</span>
      </div>

      <button
        style={styles.placeOrderBtn}
        onClick={onPlaceOrder}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
      >
        Place Order
      </button>

      <div style={{ marginTop: '12px', fontSize: '12px', color: '#758173', textAlign: 'center' }}>
        By clicking "Place Order" you agree to the 
        <a href="#" style={{ color: '#647A67' }}> ShopMart Terms</a>
      </div>
    </div>
  );
};

export default CheckoutSummary;
