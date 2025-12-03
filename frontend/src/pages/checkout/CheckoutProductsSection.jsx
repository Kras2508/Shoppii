import React from 'react';

const CheckoutProductsSection = ({ groupedByShop, styles, formatPrice }) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <span>📦</span> Sản Phẩm
      </h2>
      {Object.values(groupedByShop).map(({ shop, items }) => (
        <div key={shop.shop_id} style={styles.shopGroup}>
          <div style={styles.shopName}>
            <span>🏪</span> {shop.shop_name}
          </div>
          {items.map(item => (
            <div key={item.item_id} style={styles.productItem}>
              <img
                src={item.image_url}
                alt={item.product_name}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <div style={styles.productName}>{item.product_name}</div>
                <div style={styles.productVariant}>
                  Phân loại: {item.color}{item.type ? `, ${item.type}` : ''}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.productPrice}>{formatPrice(item.price)}</span>
                  <span style={styles.productQuantity}>x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CheckoutProductsSection;
