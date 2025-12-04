import React from 'react';
import CartItem from './CartItem';

const CartShopGroup = ({ shop, items, selectedItems, onQuantityChange, onSelect, onRemove, onSelectShop, styles }) => {
  const allSelected = items.length > 0 && items.every(item => selectedItems?.has(item.item_id));
  
  return (
    <div style={styles.shopGroup}>
      {/* Shop Header */}
      <div style={styles.shopHeader}>
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={allSelected}
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
          key={item.item_id || item.cart_item_id}
          item={item}
          selected={selectedItems?.has(item.item_id)}
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
