import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onQuantityChange, onSelect, onRemove, styles }) => {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div style={styles.cartItem}>
      {/* Checkbox */}
      <input
        type="checkbox"
        style={styles.checkbox}
        checked={item.selected}
        onChange={() => onSelect(item.id)}
      />

      {/* Product Info */}
      <div style={styles.productInfo}>
        <Link to={`/product/${item.productId}`}>
          <img
            src={item.image}
            alt={item.name}
            style={styles.productImage}
          />
        </Link>
        <div style={styles.productDetails}>
          <Link
            to={`/product/${item.productId}`}
            style={styles.productName}
            onMouseEnter={(e) => e.target.style.color = '#647A67'}
            onMouseLeave={(e) => e.target.style.color = '#1F241F'}
          >
            {item.name}
          </Link>
          <div style={styles.productVariant}>
            {item.variant.color && `Màu: ${item.variant.color}`}
            {item.variant.size && `, Size: ${item.variant.size}`}
          </div>
        </div>
      </div>

      {/* Price */}
      <div style={styles.priceSection}>
        <div style={styles.oldPrice}>{formatPrice(item.oldPrice)}</div>
        <div style={styles.currentPrice}>{formatPrice(item.price)}</div>
      </div>

      {/* Quantity */}
      <div style={styles.quantityControl}>
        <button
          style={styles.quantityBtn}
          onClick={() => onQuantityChange(item.id, 'decrease')}
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
          onClick={() => onQuantityChange(item.id, 'increase')}
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
        onClick={() => onRemove(item.id)}
        onMouseEnter={(e) => e.target.style.color = '#d9534f'}
        onMouseLeave={(e) => e.target.style.color = '#999'}
      >
        Xóa
      </button>
    </div>
  );
};

export default CartItem;
