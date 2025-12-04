import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, selected, onQuantityChange, onSelect, onRemove, styles }) => {
  const formatPrice = (price) => {
    return ((price || 0) * 1000).toLocaleString('vi-VN') + ' VND';
  };

  return (
    <div style={styles.cartItem}>
      {/* Checkbox */}
      <input
        type="checkbox"
        style={styles.checkbox}
        checked={selected || false}
        onChange={() => onSelect(item.item_id)}
      />

      {/* Product Info */}
      <div style={styles.productInfo}>
        <Link to={`/product/${item.product_id}`}>
          <img
            src={item.variant_image || item.product_image || 'https://placehold.co/80x80'}
            alt={item.product_name}
            style={styles.productImage}
          />
        </Link>
        <div style={styles.productDetails}>
          <Link
            to={`/product/${item.product_id}`}
            style={styles.productName}
            onMouseEnter={(e) => e.target.style.color = '#647A67'}
            onMouseLeave={(e) => e.target.style.color = '#1F241F'}
          >
            {item.product_name}
          </Link>
          <div style={styles.productVariant}>
            {item.color && `Màu: ${item.color}`}
            {item.color && item.type && ', '}
            {item.type && `Loại: ${item.type}`}
          </div>
        </div>
      </div>

      {/* Price */}
      <div style={styles.priceSection}>
        <div style={styles.currentPrice}>{formatPrice(item.price)}</div>
      </div>

      {/* Quantity */}
      <div style={styles.quantityControl}>
        <button
          style={styles.quantityBtn}
          onClick={() => onQuantityChange(item.item_id, 'decrease')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          −
        </button>
        <input
          type="text"
          value={item.quantity}
          readOnly
          style={styles.quantityInput}
        />
        <button
          style={styles.quantityBtn}
          onClick={() => onQuantityChange(item.item_id, 'increase')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
        >
          +
        </button>
      </div>

      {/* Total */}
      <div style={styles.totalPrice}>
        {formatPrice(item.price * item.quantity)}
      </div>

      {/* Delete */}
      <button
        style={styles.deleteBtn}
        onClick={() => onRemove(item.item_id)}
        onMouseEnter={(e) => e.target.style.color = '#d9534f'}
        onMouseLeave={(e) => e.target.style.color = '#999'}
      >
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
