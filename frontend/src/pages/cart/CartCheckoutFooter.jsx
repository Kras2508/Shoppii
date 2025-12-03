import React from 'react';
import { Link } from 'react-router-dom';

const CartCheckoutFooter = ({ cartItems, selectedItems, onSelectAll, onCheckout, styles }) => {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = selectedItems.reduce((sum, item) => sum + ((item.oldPrice - item.price) * item.quantity), 0);

  return (
    <div style={styles.checkoutFooter}>
      <div style={styles.checkoutContainer}>
        <div style={styles.checkoutLeft}>
          <label style={styles.selectAllLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={cartItems.length > 0 && cartItems.every(item => item.selected)}
              onChange={onSelectAll}
            />
            Chọn Tất Cả ({cartItems.length})
          </label>
          <button
            style={styles.deleteSelected}
            onMouseEnter={(e) => e.target.style.color = '#d9534f'}
            onMouseLeave={(e) => e.target.style.color = '#999'}
          >
            Xóa
          </button>
        </div>

        <div style={styles.checkoutRight}>
          <div style={styles.checkoutInfo}>
            <div style={styles.checkoutTotal}>
              Tổng thanh toán ({totalItems} sản phẩm):
            </div>
            <div style={styles.checkoutPrice}>
              {formatPrice(totalPrice)}
            </div>
            {totalSavings > 0 && (
              <div style={styles.checkoutSavings}>
                Tiết kiệm: {formatPrice(totalSavings)}
              </div>
            )}
          </div>
          <button
            style={{
              ...styles.checkoutBtn,
              opacity: selectedItems.length === 0 ? 0.6 : 1,
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={onCheckout}
            onMouseEnter={(e) => {
              if (selectedItems.length > 0) {
                e.target.style.backgroundColor = '#556B5A';
              }
            }}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
          >
            Mua Hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCheckoutFooter;
