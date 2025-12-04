import React from 'react';
import { Link } from 'react-router-dom';

const CartCheckoutFooter = ({ cartItems, selectedItems, selectedCount, onSelectAll, onCheckout, styles }) => {
  const formatPrice = (price) => {
    return ((price || 0) * 1000).toLocaleString('vi-VN') + ' VND';
  };

  // cartItems is shops array, selectedItems is array of item_ids
  const selectedItemIds = new Set(selectedItems || []);
  
  // Calculate totals from all shops
  let totalItems = 0;
  let totalPrice = 0;
  let allItemsCount = 0;
  
  cartItems?.forEach(shop => {
    shop.items?.forEach(item => {
      allItemsCount++;
      if (selectedItemIds.has(item.item_id)) {
        totalItems += item.quantity;
        totalPrice += (item.price || 0) * item.quantity;
      }
    });
  });

  const allSelected = allItemsCount > 0 && selectedItemIds.size === allItemsCount;

  return (
    <div style={styles.checkoutFooter}>
      <div style={styles.checkoutContainer}>
        <div style={styles.checkoutLeft}>
          <label style={styles.selectAllLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={allSelected}
              onChange={onSelectAll}
            />
            Chọn Tất Cả ({allItemsCount})
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
          </div>
          <button
            style={{
              ...styles.checkoutBtn,
              opacity: selectedItemIds.size === 0 ? 0.6 : 1,
              cursor: selectedItemIds.size === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={onCheckout}
            onMouseEnter={(e) => {
              if (selectedItemIds.size > 0) {
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
