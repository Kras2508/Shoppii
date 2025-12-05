import React from 'react';
import { Link } from 'react-router-dom';

const OrderDetailProducts = ({ items, styles, formatPrice }) => {
  // Group items by shop
  const groupedByShop = items.reduce((acc, item) => {
    const shopId = item.shop?.shop_id || item.shop_id || 0;
    const shopName = item.shop?.shop_name || item.shop_name || 'Shop';
    if (!acc[shopId]) {
      acc[shopId] = {
        shop_id: shopId,
        shop_name: shopName,
        items: []
      };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const getItemPrice = (item) => {
    return item.price_at_purchase ?? item.price ?? 0;
  };

  const hasDiscount = (item) => {
    const orig = Number(item.price ?? 0);
    const final = Number(item.price_at_purchase ?? orig);
    return orig > 0 && final < orig;
  };

  return (
    <div>
      {Object.values(groupedByShop).map(shop => (
        <div key={shop.shop_id}>
          <div style={styles.shopHeader}>
            <span>🏪</span> {shop.shop_name}
          </div>

          {shop.items.map((item, idx) => (
            <div
              key={item.order_item_id || idx}
              style={{
                ...styles.productItem,
                ...(idx === shop.items.length - 1 ? styles.productItemLast : {})
              }}
            >
              <img
                src={item.variant_image || item.product_image || item.image_url || item.image || '/placeholder.png'}
                alt={item.product_name}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <Link
                  to={`/product/${item.product_id}`}
                  style={styles.productName}
                >
                  {item.product_name}
                </Link>
                <div style={styles.productVariant}>
                  {[item.color, item.type].filter(Boolean).join(' · ')}
                </div>
                <div style={styles.productPriceRow}>
                  {hasDiscount(item) && (
                    <span style={styles.productOriginalPrice}>
                      {formatPrice(item.price)}
                    </span>
                  )}
                  <span style={styles.productPrice}>
                    {formatPrice(getItemPrice(item))}
                  </span>
                  <span style={styles.productQuantity}>
                    x{item.quantity}
                  </span>
                </div>
              </div>
              <div style={styles.productTotal}>
                {formatPrice(getItemPrice(item) * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderDetailProducts;
