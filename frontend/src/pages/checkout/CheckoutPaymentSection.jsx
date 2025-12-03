import React from 'react';

const CheckoutPaymentSection = ({ paymentMethods, selectedPayment, onSelectPayment, styles }) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span>💳</span> Phương Thức Thanh Toán
      </h2>
      {paymentMethods.map(method => (
        <div
          key={method.id}
          style={{
            ...styles.paymentOption,
            ...(selectedPayment === method.id ? styles.paymentOptionActive : {})
          }}
          onClick={() => onSelectPayment(method.id)}
        >
          <input
            type="radio"
            name="payment"
            checked={selectedPayment === method.id}
            onChange={() => onSelectPayment(method.id)}
            style={styles.radio}
          />
          <span style={styles.paymentIcon}>{method.icon}</span>
          <span style={styles.paymentName}>{method.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CheckoutPaymentSection;
