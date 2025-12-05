import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => {
  const styles = {
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      alignItems: 'stretch'
    },
    noResults: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      gridColumn: '1 / -1'
    },
    noResultsIcon: {
      fontSize: '60px',
      marginBottom: '16px'
    },
    noResultsText: {
      fontSize: '16px',
      color: '#758173'
    }
  };

  if (products.length === 0) {
    return (
      <div style={styles.noResults}>
        <div style={styles.noResultsIcon}>🔍</div>
        <p style={styles.noResultsText}>Cannot find matching products</p>
      </div>
    );
  }

  return (
    <div style={styles.productsGrid}>
      {products.map(product => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
