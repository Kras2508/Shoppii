import React from 'react';

const CheckoutShippingSection = ({ shippingOptions, selectedShipping, onSelectShipping, styles, formatPrice }) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span>🚚</span> Shipping method
      </h2>
      {shippingOptions.filter(s => s.status === 'Active').map(option => (
        <div
          key={option.shipping_id}
          style={{
            ...styles.shippingOption,
            ...(selectedShipping.shipping_id === option.shipping_id ? styles.shippingOptionActive : {})
          }}
          onClick={() => onSelectShipping(option)}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedShipping.shipping_id === option.shipping_id}
            onChange={() => onSelectShipping(option)}
            style={styles.radio}
          />
          <div style={styles.shippingInfo}>
            <div style={styles.shippingName}>{option.name}</div>
            <div style={styles.shippingDays}>
              Receive in {option.estimated_days} days
            </div>
          </div>
          <div style={styles.shippingFee}>{formatPrice(option.fee)}</div>
        </div>
      ))}
    </div>
  );
};

export default CheckoutShippingSection;
