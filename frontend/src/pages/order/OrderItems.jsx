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
      <h3 style={styles.itemsTitle}>Sản Phẩm Đã Đặt</h3>
      
      {Object.values(groupedByShop).map(shop => (
        <div key={shop.shop_id} style={styles.shopGroup}>
          <div style={styles.shopHeader}>
            <span>🏪</span> {shop.shop_name}
          </div>
          
          {shop.items.map(item => (
            <div key={item.order_item_id} style={styles.productItem}>
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
                    <>
                      <span style={{ ...styles.productPrice, textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                        {formatPrice(item.price)}
                      </span>
                      <span style={{ ...styles.productPrice, color: '#e53935' }}>
                        {formatPrice(item.price_at_purchase)}
                      </span>
                    </>
                  ) : (
                    <span style={styles.productPrice}>
                      {formatPrice(getItemPrice(item))}
                    </span>
                  )}
                  <span style={styles.productQuantity}>x{item.quantity}</span>
                </div>
              </div>
              <div style={styles.productTotal}>
                {formatPrice(getItemPrice(item) * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      {/* Order Summary */}
      <div style={styles.orderSummary}>
        <div style={styles.summaryRow}>
          <span>Tạm tính</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Phí vận chuyển</span>
          <span>{formatPrice(order.shipping_fee)}</span>
        </div>
        {order.discount > 0 && (
          <div style={styles.summaryRow}>
            <span>Giảm giá</span>
            <span style={{ color: '#647A67' }}>-{formatPrice(order.discount)}</span>
          </div>
        )}
        <div style={styles.summaryTotal}>
          <span>Tổng cộng</span>
          <span style={styles.totalAmount}>{formatPrice(order.total_price || order.total_amount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItems;
