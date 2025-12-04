import React from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../api/productService.js';
import { categoryService } from '../api/categoryService.js';
import { shopService } from '../api/shopService.js';

const HomePage = () => {
  const [hoveredProduct, setHoveredProduct] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [categorySlide, setCategorySlide] = React.useState(0);

  // State for fetched data
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [shops, setShops] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes, shopsRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts({ limit: 20 }),
          shopService.getShops({ limit: 10 })
        ]);

        const categoriesData = (categoriesRes.data?.data?.flat || []).map(cat => ({
          ...cat,
          id: cat.category_id,
          name: cat.category_name
        }));

        setCategories(categoriesData);
        setProducts(productsRes.data?.data?.products || []);
        setShops(shopsRes.data?.data?.shops || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    },
    // Banner Slider
    bannerSection: {
      backgroundColor: '#C5EFCB',
      padding: '20px'
    },
    bannerContainer: {
      position: 'relative',
      height: '300px',
      backgroundColor: '#647A67',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bannerContent: {
      textAlign: 'center',
      color: 'white',
      padding: '40px'
    },
    bannerTitle: {
      fontSize: '42px',
      fontWeight: '700',
      marginBottom: '15px'
    },
    bannerSubtitle: {
      fontSize: '18px',
      marginBottom: '25px',
      opacity: 0.95
    },
    bannerButton: {
      backgroundColor: 'white',
      color: '#647A67',
      border: 'none',
      padding: '12px 35px',
      height: '380px',
      objectFit: 'cover'
    },
    categoriesSection: {
      padding: '40px 0',
      backgroundColor: 'white'
    },
    categoriesContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    categoriesTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '24px'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '24px'
    },
    categoryItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    },
    categoryIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#C5EFCB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px',
      fontSize: '32px',
      transition: 'all 0.3s ease'
    },
    categoryName: {
      fontSize: '14px',
      color: '#3C433B',
      textAlign: 'center'
    },
    flashSaleSection: {
      padding: '40px 0',
      backgroundColor: '#fff'
    },
    flashSaleContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    flashSaleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      padding: '20px',
      background: 'linear-gradient(90deg, #647A67 0%, #8FA38A 100%)',
      borderRadius: '8px'
    },
    flashSaleTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    flashSaleTitleText: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'white'
    },
    flashSaleTimer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    timerBox: {
      backgroundColor: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '18px',
      fontWeight: '700',
      color: '#647A67'
    },
    timerSeparator: {
      color: 'white',
      fontSize: '18px',
      fontWeight: '700'
    },
    seeAllLink: {
      color: 'white',
      fontSize: '14px',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      alignItems: 'stretch'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      position: 'relative'
    },
    productBadge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      backgroundColor: '#FF6B6B',
      color: 'white',
      padding: '6px 12px',
      fontSize: '16px',
      fontWeight: '700',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
    },
    productInfo: {
      padding: '12px'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#1F241F',
      marginBottom: '8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      lineHeight: '1.4',
      height: '45px'
    },
    productPriceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    productPrice: {
      fontSize: '20px',
      fontWeight: '700',
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
      color: '#666'
    },
    productRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    productSold: {
      color: '#999'
    },
    dealsSection: {
      padding: '40px 0',
      backgroundColor: '#f5f5f5'
    },
    dealsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    dealsTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '24px'
    },
    categorySliderWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    categorySliderButton: {
      backgroundColor: '#647A67',
      color: 'white',
      border: 'none',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      transition: 'all 0.3s ease',
      flexShrink: 0
    },
    categorySliderContent: {
      display: 'flex',
      gap: '24px',
      overflow: 'hidden',
      flex: 1
    },
    categorySliderTrack: {
      display: 'flex',
      gap: '24px',
      transition: 'transform 0.3s ease',
      width: '100%'
    }
  };

  const visibleCategories = categories.slice(categorySlide, categorySlide + 8);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, justifyContent: 'center', alignItems: 'center' }}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  // Show all products in Today's Deals
  const todayDeals = products.slice(0, 16);

  return (
    <div style={styles.page}>
      {/* Banner Section */}
      <section style={styles.bannerSection}>
        <div style={styles.bannerContainer}>
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=380&fit=crop"
            alt="Banner"
            style={styles.bannerImage}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section style={styles.categoriesSection}>
        <div style={styles.categoriesContainer}>
          <h2 style={styles.categoriesTitle}>Category</h2>
          <div style={styles.categorySliderWrapper}>
            <button
              style={{
                ...styles.categorySliderButton,
                opacity: categorySlide === 0 ? 0.5 : 1,
                cursor: categorySlide === 0 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCategorySlide(Math.max(0, categorySlide - 8))}
              disabled={categorySlide === 0}
            >
              ◀
            </button>
            <div style={styles.categorySliderContent}>
              <div style={styles.categorySliderTrack}>
                {visibleCategories.map((category, index) => (
                  <Link
                    key={category.id || `cat-${index}`}
                    to={`/products?category=${category.id}`}
                    style={{
                      ...styles.categoryItem,
                      minWidth: '100px',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.querySelector('.category-icon').style.backgroundColor = '#647A67';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.querySelector('.category-icon').style.backgroundColor = '#C5EFCB';
                    }}
                  >
                    <div className="category-icon" style={styles.categoryIcon}>
                      {categorySlide + index + 1}
                    </div>
                    <span style={styles.categoryName}>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <button
              style={{
                ...styles.categorySliderButton,
                opacity: categorySlide >= categories.length - 8 ? 0.5 : 1,
                cursor: categorySlide >= categories.length - 8 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCategorySlide(Math.min(categories.length - 8, categorySlide + 8))}
              disabled={categorySlide >= categories.length - 8}
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* Today's Deals Section */}
      <section style={styles.dealsSection}>
        <div style={styles.dealsContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ ...styles.dealsTitle, marginBottom: 0 }}>Today's Deals</h2>
            <Link to="/products?sale=today-deals" style={{ color: '#647A67', fontSize: '14px', textDecoration: 'none' }}>
              View more →
            </Link>
          </div>
          {/* Chỉ hiện products nếu có data hợp lệ */}
          {todayDeals.filter(p => p.product_name && p.min_price).length > 0 ? (
            <div style={styles.productsGrid}>
              {todayDeals.filter(p => p.product_name && p.min_price).map((product, index) => (
                <Link
                  key={product.product_id || `deal-${index}`}
                  to={`/product/${product.product_id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={styles.productCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                      setHoveredProduct(product.product_id);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      setHoveredProduct(null);
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={product.image || 'https://placehold.co/200x200/C5EFCB/647A67?text=Product'}
                        alt={product.product_name}
                        style={styles.productImage}
                      />
                    </div>
                    <div style={styles.productInfo}>
                      <p style={styles.productName}>{product.product_name}</p>
                      <div style={styles.productPriceRow}>
                        <span style={styles.productPrice}>{(Number(product.min_price) * 1000).toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div style={styles.productFooter}>
                        <div style={styles.productRating}>
                          <span style={{ color: '#FFB800' }}>★</span>
                          <span>{Number(product.avg_rating || 0).toFixed(1)}</span>
                        </div>
                        <span style={styles.productSold}>Sold {product.total_sold || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No recommended products yet
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
