import React from 'react';
import CartItem from './CartItem';

const CartShopGroup = ({ shop, items, onQuantityChange, onSelect, onRemove, onSelectShop, styles }) => {
  return (
    <div style={styles.shopGroup}>
      {/* Shop Header */}
      <div style={styles.shopHeader}>
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={items.every(item => item.selected)}
          onChange={() => onSelectShop(shop.id)}
        />
        <div style={styles.shopName}>
          <span>🏪</span>
          {shop.name}
        </div>
      </div>

      {/* Shop Items */}
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onSelect={onSelect}
          onRemove={onRemove}
          styles={styles}
        />
      ))}
    </div>
  );
};

export default CartShopGroup;
