import React from 'react';
import { Link } from 'react-router-dom';

const OrderItems = ({ order, styles, formatPrice }) => {
  // Group items by shop
  const groupedByShop = order.items.reduce((acc, item) => {
    const shopId = item.shop?.shop_id || item.shop_id;
    const shopName = item.shop?.shop_name || item.shop_name;
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

  // Helper to get the display price (price_at_purchase if available, otherwise price)
  const getItemPrice = (item) => item.price_at_purchase || item.price;

  return (
    <div style={styles.itemsSection}>
      <h3 style={styles.itemsTitle}>Ordered Products</h3>
      
      {Object.values(groupedByShop).map((shop, shopIndex) => (
        <div key={shop.shop_id || `shop-${shopIndex}`} style={styles.shopGroup}>
          <div style={styles.shopHeader}>
            <span>🏪 {shop.shop_name}</span>
          </div>
          
          {shop.items.map((item, itemIndex) => (
            <div key={item.order_item_id || item.item_id || `item-${shopIndex}-${itemIndex}`} style={styles.productItem}>
              <img
                src={item.image_url}
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
                  {item.color}{item.type ? `, ${item.type}` : ''}
                </div>
                <div style={styles.productPriceRow}>
                  {item.price_at_purchase && item.price_at_purchase < item.price ? (
                    <React.Fragment key={`price-${item.order_item_id}`}>
                      <span style={{ ...styles.productPrice, textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                        {formatPrice(item.price)}
                      </span>
                      <span style={{ ...styles.productPrice, color: '#e53935' }}>
                        {formatPrice(item.price_at_purchase)}
                      </span>
                    </React.Fragment>
                  ) : (
                    <span style={styles.productPrice}>
                      {formatPrice(getItemPrice(item))}
                    </span>
                  )}
                  <span style={styles.productQuantity}>x{item.quantity}</span>
                </div>
              </div>
              <div style={styles.productTotal}>
                {formatPrice(item.total_price || getItemPrice(item) * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      {/* Order Summary */}
      <div style={styles.orderSummary}>
        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Shipping Fee</span>
          <span>{formatPrice(order.shipping_fee)}</span>
        </div>
        {order.discount > 0 && (
          <div style={styles.summaryRow}>
            <span>Discount</span>
            <span style={{ color: '#647A67' }}>-{formatPrice(order.discount)}</span>
          </div>
        )}
        <div style={styles.summaryTotal}>
          <span>Total</span>
          <span style={styles.totalAmount}>{formatPrice(order.total_price || order.total_amount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItems;
