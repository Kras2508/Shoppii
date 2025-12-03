import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = ({ styles }) => {
  return (
    <div style={styles.emptyCart}>
      <div style={styles.emptyIcon}>🛒</div>
      <p style={styles.emptyText}>Giỏ hàng của bạn còn trống</p>
      <Link
        to="/"
        style={styles.shopNowBtn}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
      >
        Mua Sắm Ngay
      </Link>
    </div>
  );
};

export default EmptyCart;
