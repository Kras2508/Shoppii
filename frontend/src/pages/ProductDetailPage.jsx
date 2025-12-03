import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getReviewsByProductId, getRatingDistribution } from '../mockData/mockReviews';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all'); // all, 5, 4, 3, 2, 1, hasImage

  // Get reviews for this product
  const productId = parseInt(id) || 1;
  const reviews = getReviewsByProductId(productId);
  const ratingDistribution = getRatingDistribution(productId);
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'hasImage') return review.images && review.images.length > 0;
    return review.rating === parseInt(reviewFilter);
  });

  // Mock product data - sau này sẽ fetch từ API theo id
  const product = {
    id: parseInt(id) || 1,
    name: 'Áo thun nam cotton cao cấp Premium - Chất liệu mềm mại, thoáng mát, phù hợp mọi phong cách',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop',
    ],
    price: 129000,
    oldPrice: 299000,
    discount: 57,
    rating: 4.8,
    reviewCount: 1234,
    sold: 5678,
    stock: 999,
    category: 'Thời Trang Nam',
    variants: {
      colors: ['Trắng', 'Đen', 'Xám', 'Navy'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    shop: {
      id: 1,
      name: 'Cửa hàng Kim Tín',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kimtin',
      rating: 4.9,
      responseRate: 98,
      responseTime: 'trong vài phút',
      followers: 12500,
      products: 256,
      joined: '2 năm trước'
    },
    description: `
      <h3>Mô tả sản phẩm</h3>
      <p>Áo thun nam cotton cao cấp với chất liệu 100% cotton tự nhiên, mềm mại và thoáng mát.</p>
      <ul>
        <li>Chất liệu: 100% Cotton cao cấp</li>
        <li>Form áo: Regular fit, phù hợp mọi vóc dáng</li>
        <li>Màu sắc: Đa dạng, không phai màu sau nhiều lần giặt</li>
        <li>Kích thước: S - XXL</li>
        <li>Xuất xứ: Việt Nam</li>
      </ul>
      <h3>Hướng dẫn bảo quản</h3>
      <ul>
        <li>Giặt máy ở chế độ nhẹ, nhiệt độ dưới 30°C</li>
        <li>Không sử dụng chất tẩy mạnh</li>
        <li>Phơi nơi thoáng mát, tránh ánh nắng trực tiếp</li>
        <li>Ủi ở nhiệt độ thấp</li>
      </ul>
    `,
    specifications: [
      { label: 'Thương hiệu', value: 'ShopMart Fashion' },
      { label: 'Xuất xứ', value: 'Việt Nam' },
      { label: 'Chất liệu', value: '100% Cotton' },
      { label: 'Kiểu dáng', value: 'Regular Fit' },
      { label: 'Mùa phù hợp', value: 'Quanh năm' }
    ]
  };

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: 'Quần jean nam slim fit cao cấp',
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=200&h=200&fit=crop',
      price: 259000,
      oldPrice: 499000,
      discount: 48,
      rating: 4.9,
      sold: 876
    },
    {
      id: 3,
      name: 'Giày thể thao nam sneaker',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      price: 449000,
      oldPrice: 899000,
      discount: 50,
      rating: 4.7,
      sold: 543
    },
    {
      id: 4,
      name: 'Túi xách nam da PU cao cấp',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop',
      price: 199000,
      oldPrice: 450000,
      discount: 56,
      rating: 4.6,
      sold: 2103
    },
    {
      id: 5,
      name: 'Đồng hồ thông minh smartwatch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      price: 599000,
      oldPrice: 1299000,
      discount: 54,
      rating: 4.9,
      sold: 654
    },
    {
      id: 6,
      name: 'Nón lưỡi trai thể thao',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=200&fit=crop',
      price: 89000,
      oldPrice: 159000,
      discount: 44,
      rating: 4.5,
      sold: 3245
    },
    {
      id: 7,
      name: 'Kính mát thời trang nam',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      price: 149000,
      oldPrice: 299000,
      discount: 50,
      rating: 4.4,
      sold: 1876
    }
  ];

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    console.log('Add to cart:', { productId: product.id, quantity, variant: selectedVariant });
    // Hiển thị thông báo thành công và hỏi có muốn xem giỏ hàng không
    const goToCart = window.confirm('Đã thêm vào giỏ hàng! Bạn có muốn xem giỏ hàng không?');
    if (goToCart) {
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // Tạo checkout item theo database schema (ProductItem)
    const checkoutItem = {
      item_id: product.id,
      product_id: product.id,
      product_name: product.name,
      image_url: product.images[0],
      color: selectedVariant?.color || product.variants.colors[0],
      type: selectedVariant?.size || product.variants.sizes[0],
      price: product.price,
      quantity: quantity,
      shop: {
        shop_id: product.shop.id,
        shop_name: product.shop.name
      }
    };
    
    navigate('/checkout', { state: { items: [checkoutItem] } });
  };

  const styles = {
    page: {
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      paddingBottom: '40px'
    },
    // Breadcrumb
    breadcrumb: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '12px 20px',
      fontSize: '13px',
      color: '#758173'
    },
    breadcrumbLink: {
      color: '#647A67',
      textDecoration: 'none'
    },
    // Main Container
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    // Product Info Section
    productSection: {
      display: 'grid',
      gridTemplateColumns: '450px 1fr',
      gap: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px'
    },
    // Image Gallery
    imageGallery: {
      position: 'sticky',
      top: '100px'
    },
    mainImage: {
      width: '100%',
      height: '450px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      marginBottom: '12px'
    },
    thumbnails: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto'
    },
    thumbnail: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '4px',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.2s ease'
    },
    thumbnailActive: {
      border: '2px solid #647A67'
    },
    // Product Details
    productDetails: {
      display: 'flex',
      flexDirection: 'column'
    },
    productName: {
      fontSize: '20px',
      fontWeight: '500',
      color: '#1F241F',
      lineHeight: '1.5',
      marginBottom: '12px'
    },
    ratingRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '16px'
    },
    ratingStars: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#FFB800'
    },
    ratingText: {
      fontSize: '16px',
      color: '#647A67',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    divider: {
      color: '#e0e0e0',
      margin: '0 8px'
    },
    statsText: {
      fontSize: '14px',
      color: '#758173'
    },
    // Price Section
    priceSection: {
      backgroundColor: '#C6DEC6',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    priceRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    currentPrice: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#647A67'
    },
    oldPrice: {
      fontSize: '16px',
      color: '#758173',
      textDecoration: 'line-through'
    },
    discountBadge: {
      backgroundColor: '#647A67',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
    },
    // Variant Section
    variantSection: {
      marginBottom: '20px'
    },
    variantLabel: {
      fontSize: '14px',
      color: '#758173',
      marginBottom: '8px'
    },
    variantOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    variantOption: {
      padding: '10px 20px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s ease'
    },
    variantOptionActive: {
      border: '1px solid #647A67',
      color: '#647A67'
    },
    // Quantity Section
    quantitySection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '24px'
    },
    quantityLabel: {
      fontSize: '14px',
      color: '#758173'
    },
    quantityControl: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #e0e0e0',
      borderRadius: '4px'
    },
    quantityBtn: {
      width: '36px',
      height: '36px',
      border: 'none',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s'
    },
    quantityInput: {
      width: '60px',
      height: '36px',
      border: 'none',
      borderLeft: '1px solid #e0e0e0',
      borderRight: '1px solid #e0e0e0',
      textAlign: 'center',
      fontSize: '16px',
      fontFamily: 'inherit'
    },
    stockText: {
      fontSize: '14px',
      color: '#758173'
    },
    // Action Buttons
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px'
    },
    addToCartBtn: {
      flex: 1,
      padding: '14px 24px',
      border: '1px solid #647A67',
      backgroundColor: '#C6DEC6',
      color: '#647A67',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s ease'
    },
    buyNowBtn: {
      flex: 1,
      padding: '14px 24px',
      border: 'none',
      backgroundColor: '#647A67',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    // Shop Section
    shopSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px'
    },
    shopInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    shopAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #C5EFCB'
    },
    shopDetails: {
      flex: 1
    },
    shopName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '4px'
    },
    shopStatus: {
      fontSize: '13px',
      color: '#758173',
      marginBottom: '8px'
    },
    shopButtons: {
      display: 'flex',
      gap: '8px'
    },
    shopBtn: {
      padding: '8px 16px',
      border: '1px solid #647A67',
      backgroundColor: 'white',
      color: '#647A67',
      fontSize: '13px',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s ease'
    },
    shopStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #e0e0e0'
    },
    shopStat: {
      textAlign: 'center'
    },
    shopStatLabel: {
      fontSize: '12px',
      color: '#758173',
      marginBottom: '4px'
    },
    shopStatValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#647A67'
    },
    // Description Section
    descriptionSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    specTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    specRow: {
      borderBottom: '1px solid #f0f0f0'
    },
    specLabel: {
      padding: '12px 16px',
      backgroundColor: '#f9f9f9',
      color: '#758173',
      fontSize: '14px',
      width: '180px'
    },
    specValue: {
      padding: '12px 16px',
      color: '#1F241F',
      fontSize: '14px'
    },
    descriptionContent: {
      fontSize: '14px',
      lineHeight: '1.8',
      color: '#3C433B'
    },
    // Related Products Section
    relatedSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '12px'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '4px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e5e7eb',
      textDecoration: 'none'
    },
    productImage: {
      width: '100%',
      height: '160px',
      objectFit: 'cover'
    },
    productInfo: {
      padding: '10px'
    },
    productCardName: {
      fontSize: '13px',
      color: '#1F241F',
      marginBottom: '8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      lineHeight: '1.4'
    },
    productCardPrice: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#647A67'
    },
    productCardSold: {
      fontSize: '11px',
      color: '#758173'
    },
    // Review Section Styles
    reviewSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px'
    },
    reviewHeader: {
      display: 'flex',
      gap: '24px',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#fef8f8',
      borderRadius: '8px',
      border: '1px solid #C5EFCB'
    },
    reviewOverview: {
      textAlign: 'center',
      minWidth: '150px'
    },
    reviewBigRating: {
      fontSize: '48px',
      fontWeight: '600',
      color: '#647A67'
    },
    reviewStarsLarge: {
      fontSize: '20px',
      color: '#FFB800',
      marginBottom: '4px'
    },
    reviewTotalCount: {
      fontSize: '14px',
      color: '#758173'
    },
    reviewFilters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center',
      flex: 1
    },
    reviewFilterBtn: {
      padding: '8px 16px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'all 0.2s'
    },
    reviewFilterBtnActive: {
      border: '1px solid #647A67',
      color: '#647A67',
      backgroundColor: '#f0fff0'
    },
    reviewList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    reviewItem: {
      padding: '16px',
      borderBottom: '1px solid #f0f0f0'
    },
    reviewItemHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    reviewAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      backgroundColor: '#ddd'
    },
    reviewUserInfo: {
      flex: 1
    },
    reviewUserName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '2px'
    },
    reviewStars: {
      fontSize: '12px',
      color: '#FFB800'
    },
    reviewDate: {
      fontSize: '12px',
      color: '#999'
    },
    reviewVariant: {
      fontSize: '12px',
      color: '#999',
      marginBottom: '8px'
    },
    reviewComment: {
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.6',
      marginBottom: '12px'
    },
    reviewImages: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    reviewImage: {
      width: '80px',
      height: '80px',
      objectFit: 'cover',
      borderRadius: '4px',
      cursor: 'pointer',
      border: '1px solid #e0e0e0'
    },
    reviewAttributes: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
      flexWrap: 'wrap'
    },
    reviewAttribute: {
      padding: '4px 8px',
      backgroundColor: '#f0fff0',
      color: '#647A67',
      fontSize: '11px',
      borderRadius: '4px'
    },
    noReviews: {
      textAlign: 'center',
      padding: '40px',
      color: '#999'
    },
    ratingBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '4px'
    },
    ratingBarLabel: {
      fontSize: '12px',
      color: '#666',
      width: '50px'
    },
    ratingBarTrack: {
      flex: 1,
      height: '8px',
      backgroundColor: '#e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    ratingBarFill: {
      height: '100%',
      backgroundColor: '#647A67',
      borderRadius: '4px'
    },
    ratingBarCount: {
      fontSize: '12px',
      color: '#999',
      width: '30px',
      textAlign: 'right'
    }
  };

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Trang chủ</Link>
        <span> › </span>
        <Link to="/" style={styles.breadcrumbLink}>{product.category}</Link>
        <span> › </span>
        <span style={{ color: '#3C433B' }}>{product.name.substring(0, 50)}...</span>
      </nav>

      <div style={styles.container}>
        {/* Product Main Section */}
        <div style={styles.productSection}>
          {/* Image Gallery */}
          <div style={styles.imageGallery}>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              style={styles.mainImage}
            />
            <div style={styles.thumbnails}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    ...styles.thumbnail,
                    ...(selectedImage === idx ? styles.thumbnailActive : {})
                  }}
                  onClick={() => setSelectedImage(idx)}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div style={styles.productDetails}>
            <h1 style={styles.productName}>{product.name}</h1>

            {/* Rating Row */}
            <div style={styles.ratingRow}>
              <div style={styles.ratingStars}>
                <span style={styles.ratingText}>{product.rating}</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star}>★</span>
                ))}
              </div>
              <span style={styles.divider}>|</span>
              <span style={styles.statsText}>
                <strong>{product.reviewCount.toLocaleString()}</strong> Đánh Giá
              </span>
              <span style={styles.divider}>|</span>
              <span style={styles.statsText}>
                <strong>{product.sold.toLocaleString()}</strong> Đã Bán
              </span>
            </div>

            {/* Price Section */}
            <div style={styles.priceSection}>
              <div style={styles.priceRow}>
                <span style={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
                <span style={styles.currentPrice}>{formatPrice(product.price)}</span>
                <span style={styles.discountBadge}>-{product.discount}% GIẢM</span>
              </div>
            </div>

            {/* Variant - Color */}
            <div style={styles.variantSection}>
              <div style={styles.variantLabel}>Màu Sắc</div>
              <div style={styles.variantOptions}>
                {product.variants.colors.map((color, idx) => (
                  <button
                    key={idx}
                    style={{
                      ...styles.variantOption,
                      ...(selectedVariant?.color === color ? styles.variantOptionActive : {})
                    }}
                    onClick={() => setSelectedVariant({ ...selectedVariant, color })}
                    onMouseEnter={(e) => e.target.style.borderColor = '#647A67'}
                    onMouseLeave={(e) => {
                      if (selectedVariant?.color !== color) {
                        e.target.style.borderColor = '#e0e0e0';
                      }
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant - Size */}
            <div style={styles.variantSection}>
              <div style={styles.variantLabel}>Kích Cỡ</div>
              <div style={styles.variantOptions}>
                {product.variants.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    style={{
                      ...styles.variantOption,
                      ...(selectedVariant?.size === size ? styles.variantOptionActive : {})
                    }}
                    onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                    onMouseEnter={(e) => e.target.style.borderColor = '#647A67'}
                    onMouseLeave={(e) => {
                      if (selectedVariant?.size !== size) {
                        e.target.style.borderColor = '#e0e0e0';
                      }
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={styles.quantitySection}>
              <span style={styles.quantityLabel}>Số Lượng</span>
              <div style={styles.quantityControl}>
                <button
                  style={styles.quantityBtn}
                  onClick={() => handleQuantityChange('decrease')}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  style={styles.quantityInput}
                />
                <button
                  style={styles.quantityBtn}
                  onClick={() => handleQuantityChange('increase')}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  +
                </button>
              </div>
              <span style={styles.stockText}>{product.stock} sản phẩm có sẵn</span>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
                style={styles.addToCartBtn}
                onClick={handleAddToCart}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8D2B3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#C6DEC6'}
              >
                🛒 Thêm Vào Giỏ Hàng
              </button>
              <button
                style={styles.buyNowBtn}
                onClick={handleBuyNow}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
              >
                Mua Ngay
              </button>
            </div>

            {/* Guarantee Icons */}
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#758173' }}>
              <span>✓ Hoàn trả miễn phí 15 ngày</span>
              <span>✓ Hàng chính hãng 100%</span>
              <span>✓ Giao hàng miễn phí</span>
            </div>
          </div>
        </div>

        {/* Shop Section */}
        <div style={styles.shopSection}>
          <div style={styles.shopInfo}>
            <img
              src={product.shop.avatar}
              alt={product.shop.name}
              style={styles.shopAvatar}
            />
            <div style={styles.shopDetails}>
              <div style={styles.shopName}>{product.shop.name}</div>
              <div style={styles.shopStatus}>Online {product.shop.responseTime}</div>
              <div style={styles.shopButtons}>
                <button
                  style={styles.shopBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#C6DEC6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  💬 Chat Ngay
                </button>
                <button
                  style={styles.shopBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#C6DEC6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  🏪 Xem Shop
                </button>
              </div>
            </div>
          </div>
          <div style={styles.shopStats}>
            <div style={styles.shopStat}>
              <div style={styles.shopStatLabel}>Đánh Giá</div>
              <div style={styles.shopStatValue}>{product.shop.rating}★</div>
            </div>
            <div style={styles.shopStat}>
              <div style={styles.shopStatLabel}>Tỉ Lệ Phản Hồi</div>
              <div style={styles.shopStatValue}>{product.shop.responseRate}%</div>
            </div>
            <div style={styles.shopStat}>
              <div style={styles.shopStatLabel}>Người Theo Dõi</div>
              <div style={styles.shopStatValue}>{product.shop.followers.toLocaleString()}</div>
            </div>
            <div style={styles.shopStat}>
              <div style={styles.shopStatLabel}>Sản Phẩm</div>
              <div style={styles.shopStatValue}>{product.shop.products}</div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        <div style={styles.descriptionSection}>
          <h2 style={styles.sectionTitle}>Chi Tiết Sản Phẩm</h2>
          <table style={styles.specTable}>
            <tbody>
              {product.specifications.map((spec, idx) => (
                <tr key={idx} style={styles.specRow}>
                  <td style={styles.specLabel}>{spec.label}</td>
                  <td style={styles.specValue}>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Description */}
        <div style={styles.descriptionSection}>
          <h2 style={styles.sectionTitle}>Mô Tả Sản Phẩm</h2>
          <div 
            style={styles.descriptionContent}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Product Reviews */}
        <div style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>Đánh Giá Sản Phẩm</h2>
          
          {/* Review Header with Rating Overview */}
          <div style={styles.reviewHeader}>
            {/* Rating Overview */}
            <div style={styles.reviewOverview}>
              <div style={styles.reviewBigRating}>{avgRating}</div>
              <div style={styles.reviewStarsLarge}>
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <div style={styles.reviewTotalCount}>{reviews.length} đánh giá</div>
            </div>

            {/* Rating Distribution */}
            <div style={{ flex: 1, maxWidth: '300px' }}>
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} style={styles.ratingBar}>
                  <span style={styles.ratingBarLabel}>{star} ★</span>
                  <div style={styles.ratingBarTrack}>
                    <div style={{
                      ...styles.ratingBarFill,
                      width: reviews.length > 0 
                        ? `${(ratingDistribution[star] / reviews.length) * 100}%` 
                        : '0%'
                    }} />
                  </div>
                  <span style={styles.ratingBarCount}>{ratingDistribution[star]}</span>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={styles.reviewFilters}>
              {[
                { key: 'all', label: 'Tất Cả' },
                { key: '5', label: '5 Sao' },
                { key: '4', label: '4 Sao' },
                { key: '3', label: '3 Sao' },
                { key: '2', label: '2 Sao' },
                { key: '1', label: '1 Sao' },
                { key: 'hasImage', label: 'Có Hình Ảnh' }
              ].map(filter => (
                <button
                  key={filter.key}
                  style={{
                    ...styles.reviewFilterBtn,
                    ...(reviewFilter === filter.key ? styles.reviewFilterBtnActive : {})
                  }}
                  onClick={() => setReviewFilter(filter.key)}
                >
                  {filter.label}
                  {filter.key !== 'all' && filter.key !== 'hasImage' && (
                    <span style={{ marginLeft: '4px', color: '#999' }}>
                      ({ratingDistribution[parseInt(filter.key)] || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Review List */}
          <div style={styles.reviewList}>
            {filteredReviews.length === 0 ? (
              <div style={styles.noReviews}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
                <p>Chưa có đánh giá nào{reviewFilter !== 'all' ? ' cho bộ lọc này' : ''}</p>
              </div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.review_id} style={styles.reviewItem}>
                  <div style={styles.reviewItemHeader}>
                    {review.is_anonymous ? (
                      <div style={{
                        ...styles.reviewAvatar,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        backgroundColor: '#f0f0f0'
                      }}>👤</div>
                    ) : (
                      <img
                        src={review.avatar || 'https://i.pravatar.cc/150?img=0'}
                        alt={review.customer_name}
                        style={styles.reviewAvatar}
                      />
                    )}
                    <div style={styles.reviewUserInfo}>
                      <div style={styles.reviewUserName}>
                        {review.is_anonymous ? 'Khách hàng ẩn danh' : review.customer_name}
                      </div>
                      <div style={styles.reviewStars}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>

                  <div style={styles.reviewComment}>
                    {review.comment}
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div style={styles.reviewImages}>
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx + 1}`}
                          style={styles.reviewImage}
                          onClick={() => window.open(img, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Review Attributes */}
                  {review.attributes && review.attributes.length > 0 && (
                    <div style={styles.reviewAttributes}>
                      {review.attributes.map((attr, idx) => {
                        const attrLabels = {
                          quality: '✅ Chất lượng tốt',
                          color: '🎨 Màu sắc đẹp',
                          size: '📏 Vừa vặn',
                          delivery: '🚚 Giao hàng nhanh'
                        };
                        return (
                          <span key={idx} style={styles.reviewAttribute}>
                            {attrLabels[attr] || attr}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        <div style={styles.relatedSection}>
          <h2 style={styles.sectionTitle}>Sản Phẩm Tương Tự</h2>
          <div style={styles.productsGrid}>
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.productImage}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: '#647A67',
                    color: 'white',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    borderRadius: '2px'
                  }}>
                    -{item.discount}%
                  </span>
                </div>
                <div style={styles.productInfo}>
                  <p style={styles.productCardName}>{item.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={styles.productCardPrice}>{formatPrice(item.price)}</span>
                    <span style={styles.productCardSold}>Đã bán {item.sold}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
