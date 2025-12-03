import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [hoveredProduct, setHoveredProduct] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [categorySlide, setCategorySlide] = React.useState(0);

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
      padding: '4px 8px',
      fontSize: '12px',
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

  const categories = [
    { id: 1, name: 'Thời Trang Nam', icon: '👔' },
    { id: 2, name: 'Thời Trang Nữ', icon: '👗' },
    { id: 3, name: 'Điện Thoại', icon: '📱' },
    { id: 4, name: 'Máy Tính', icon: '💻' },
    { id: 5, name: 'Sắc Đẹp', icon: '💄' },
    { id: 6, name: 'Nhà Cửa', icon: '🏠' },
    { id: 7, name: 'Thể Thao', icon: '⚽' },
    { id: 8, name: 'Đồ Chơi', icon: '🎮' },
    { id: 9, name: 'Giày Dép', icon: '👟' },
    { id: 10, name: 'Túi Xách', icon: '👜' },
    { id: 11, name: 'Đồng Hồ', icon: '⌚' },
    { id: 12, name: 'Kính Mắt', icon: '👓' },
    { id: 13, name: 'Trang Sức', icon: '💍' },
    { id: 14, name: 'Mỹ Phẩm', icon: '💅' },
    { id: 15, name: 'Điện Gia Dụng', icon: '⚡' },
    { id: 16, name: 'Dụng Cụ Nhà Bếp', icon: '🍳' },
    { id: 17, name: 'Sách & Học Tập', icon: '📚' },
    { id: 18, name: 'Du Lịch', icon: '✈️' },
    { id: 19, name: 'Ô Tô - Xe Máy', icon: '🏍️' },
    { id: 20, name: 'Thú Cưng', icon: '🐕' },
    { id: 21, name: 'Nông Sản', icon: '🥕' },
    { id: 22, name: 'Sức Khỏe', icon: '💊' }
  ];

  const visibleCategories = categories.slice(categorySlide, categorySlide + 8);

  const flashSaleProducts = [
    {
      id: 1,
      name: 'Áo thun nam cotton cao cấp',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      price: '129.000đ',
      oldPrice: '299.000đ',
      discount: '-57%',
      rating: 4.8,
      sold: 1234
    },
    {
      id: 2,
      name: 'Quần jean nữ dáng ôm',
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=200&fit=crop',
      price: '259.000đ',
      oldPrice: '499.000đ',
      discount: '-48%',
      rating: 4.9,
      sold: 876
    },
    {
      id: 3,
      name: 'Giày thể thao nam sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      price: '449.000đ',
      oldPrice: '899.000đ',
      discount: '-50%',
      rating: 4.7,
      sold: 543
    },
    {
      id: 4,
      name: 'Túi xách nữ da PU cao cấp',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
      price: '199.000đ',
      oldPrice: '450.000đ',
      discount: '-56%',
      rating: 4.6,
      sold: 2103
    },
    {
      id: 5,
      name: 'Đồng hồ thông minh smartwatch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      price: '599.000đ',
      oldPrice: '1.299.000đ',
      discount: '-54%',
      rating: 4.9,
      sold: 654
    },
    {
      id: 6,
      name: 'Tai nghe bluetooth 5.0',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      price: '149.000đ',
      oldPrice: '399.000đ',
      discount: '-63%',
      rating: 4.5,
      sold: 3245
    }
  ];

  const todayDeals = [
    {
      id: 7,
      name: 'Balo laptop chống nước cao cấp',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
      price: '229.000đ',
      oldPrice: '499.000đ',
      discount: '-54%',
      rating: 4.7,
      sold: 432
    },
    {
      id: 8,
      name: 'Kem dưỡng da mặt vitamin C',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=200&fit=crop',
      price: '179.000đ',
      oldPrice: '350.000đ',
      discount: '-49%',
      rating: 4.8,
      sold: 876
    },
    {
      id: 9,
      name: 'Bình giữ nhiệt inox 500ml',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=200&fit=crop',
      price: '99.000đ',
      oldPrice: '199.000đ',
      discount: '-50%',
      rating: 4.6,
      sold: 1543
    },
    {
      id: 10,
      name: 'Chuột gaming RGB LED',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop',
      price: '129.000đ',
      oldPrice: '299.000đ',
      discount: '-57%',
      rating: 4.7,
      sold: 765
    },
    {
      id: 11,
      name: 'Dây cáp sạc nhanh Type-C',
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200&h=200&fit=crop',
      price: '39.000đ',
      oldPrice: '99.000đ',
      discount: '-61%',
      rating: 4.5,
      sold: 5432
    },
    {
      id: 12,
      name: 'Ốp lưng điện thoại silicon',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop',
      price: '29.000đ',
      oldPrice: '79.000đ',
      discount: '-63%',
      rating: 4.4,
      sold: 9876
    }
  ];

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
          <h2 style={styles.categoriesTitle}>Danh Mục</h2>
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
                {visibleCategories.map((category) => (
                  <Link
                    key={category.id}
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
                      {category.icon}
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

      {/* Flash Sale Section */}
      <section style={styles.flashSaleSection}>
        <div style={styles.flashSaleContainer}>
          <div style={styles.flashSaleHeader}>
            <div style={styles.flashSaleTitle}>
              <span style={styles.flashSaleTitleText}>⚡ FLASH SALE</span>
              <div style={styles.flashSaleTimer}>
                <span style={styles.timerBox}>02</span>
                <span style={styles.timerSeparator}>:</span>
                <span style={styles.timerBox}>34</span>
                <span style={styles.timerSeparator}>:</span>
                <span style={styles.timerBox}>56</span>
              </div>
            </div>
            <Link to="/products?sale=flash-sale" style={styles.seeAllLink}>
              Xem tất cả →
            </Link>
          </div>
          <div style={styles.productsGrid}>
            {flashSaleProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={styles.productCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                    setHoveredProduct(product.id);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    setHoveredProduct(null);
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={product.image}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    <span style={styles.productBadge}>{product.discount}</span>
                  </div>
                  <div style={styles.productInfo}>
                    <p style={styles.productName}>{product.name}</p>
                    <div style={styles.productPriceRow}>
                      <span style={styles.productPrice}>{product.price}</span>
                      <span style={styles.productOldPrice}>{product.oldPrice}</span>
                    </div>
                    <div style={styles.productFooter}>
                      <div style={styles.productRating}>
                        <span style={{ color: '#FFB800' }}>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span style={styles.productSold}>Đã bán {product.sold}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals Section */}
      <section style={styles.dealsSection}>
        <div style={styles.dealsContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ ...styles.dealsTitle, marginBottom: 0 }}>Gợi Ý Hôm Nay</h2>
            <Link to="/products?sale=today-deals" style={{ color: '#647A67', fontSize: '14px', textDecoration: 'none' }}>
              Xem tất cả →
            </Link>
          </div>
          <div style={styles.productsGrid}>
            {todayDeals.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={styles.productCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                    setHoveredProduct(product.id);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    setHoveredProduct(null);
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={product.image}
                      alt={product.name}
                      style={styles.productImage}
                    />
                    <span style={styles.productBadge}>{product.discount}</span>
                  </div>
                  <div style={styles.productInfo}>
                    <p style={styles.productName}>{product.name}</p>
                    <div style={styles.productPriceRow}>
                      <span style={styles.productPrice}>{product.price}</span>
                      <span style={styles.productOldPrice}>{product.oldPrice}</span>
                    </div>
                    <div style={styles.productFooter}>
                      <div style={styles.productRating}>
                        <span style={{ color: '#FFB800' }}>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span style={styles.productSold}>Đã bán {product.sold}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
