import React from 'react';

const CheckoutPaymentSection = ({ paymentMethods, selectedPayment, onSelectPayment, styles }) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span>💳</span> Payment method
      </h2>
      {paymentMethods.map(method => (
        <div
          key={method}
          style={{
            ...styles.paymentOption,
            ...(selectedPayment === method ? styles.paymentOptionActive : {})
          }}
          onClick={() => onSelectPayment(method)}
        >
          <input
            type="radio"
            name="payment"
            checked={selectedPayment === method}
            onChange={() => onSelectPayment(method)}
            style={styles.radio}
          />
          <span style={styles.paymentName}>{method}</span>
        </div>
      ))}
    </div>
  );
};

export default CheckoutPaymentSection;
