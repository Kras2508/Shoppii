import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const styles = {
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    productBadge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#647A67',
      color: 'white',
      padding: '4px 8px',
      fontSize: '11px',
      fontWeight: '600',
      borderRadius: '4px'
    },
    productInfo: {
      padding: '12px'
    },
    productName: {
      fontSize: '14px',
      color: '#1F241F',
      marginBottom: '8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      lineHeight: '1.4',
      height: '40px'
    },
    productPriceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    productPrice: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#647A67'
    },
    productOldPrice: {
      fontSize: '12px',
      color: '#999',
      textDecoration: 'line-through'
    },
    productFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#758173'
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  return (
    <Link
      to={`/product/${product.product_id}`}
      style={styles.productCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={product.image}
          alt={product.product_name}
          style={styles.productImage}
        />
        <span style={styles.productBadge}>-{discount}%</span>
      </div>
      <div style={styles.productInfo}>
        <p style={styles.productName}>{product.product_name}</p>
        <div style={styles.productPriceRow}>
          <span style={styles.productPrice}>{formatPrice(product.price)}</span>
          <span style={styles.productOldPrice}>{formatPrice(product.oldPrice)}</span>
        </div>
        <div style={styles.productFooter}>
          <div style={styles.productRating}>
            <span style={{ color: '#FFB800' }}>★</span>
            <span>{product.rating}</span>
          </div>
          <span>Đã bán {product.sold}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
