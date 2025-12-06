import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { productService } from '../api/productService.js';
import { cartService } from '../api/cartService.js';
import { reviewService } from '../api/reviewService.js';
import { fetchCart } from '../redux/slice/cart.slice.js';
import createPrivateClient from '../clients/private.client.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = useMemo(() => token ? createPrivateClient(dispatch) : null, [token, dispatch]);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, reviewsRes] = await Promise.all([
          productService.getProductById(id),
          reviewService.getReviews({ target_id: id, target_type: 'Product' })
        ]);
        
        const productData = productRes.data?.data;
        // Get unique images only (remove duplicates)
        const allImages = [
          productData?.image,
          ...(productData?.variants?.map(v => v.image_url).filter(Boolean) || [])
        ].filter(Boolean);
        const productImages = [...new Set(allImages)]; // Remove duplicates

        setProduct({
          ...productData,
          name: productData?.product_name,
          category: productData?.category_name,
          description: productData?.description || 'No description',
          rating: productData?.avg_rating || 0,
          reviewCount: productData?.review_count || 0,
          sold: productData?.total_sold || 0,
          price: productData?.variants?.[0]?.price || 0,
          shop: productData?.shop_name,
          images: productImages.length > 0 ? productImages : ['https://placehold.co/400x400/C5EFCB/647A67?text=Product']
        });
        setReviews(reviewsRes.data?.data?.reviews || []);
        setSelectedVariant(productData?.variants?.[0] || null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const avgRating = product?.avg_rating || product?.rating;

  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[r.rating]++;
    }
  });

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === 'all') return true;
    if (reviewFilter === 'hasImage') return review.image_url && review.image_url.length > 0;
    return review.rating === parseInt(reviewFilter);
  });

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>{error || 'Product not found'}</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart');
      navigate('/signin');
      return;
    }

    try {
      setAddingToCart(true);
      const itemId = selectedVariant?.item_id || product.variants?.[0]?.item_id;
      if (!itemId) {
        alert('Please select a product variant');
        return;
      }

      await cartService.addToCart(itemId, quantity, privateClient);
      alert('Added to cart successfully!');
      setQuantity(1);
      // Refresh cart in Redux
      if (privateClient) {
        dispatch(fetchCart(privateClient));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return ((price || 0)).toLocaleString('vi-VN') + ' VND';
  };

  const handleQuantityChange = (action) => {
    const maxStock = selectedVariant?.stock || product.total_stock || 999;
    if (action === 'increase' && quantity < maxStock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // Go to checkout with selected variant
    if (!selectedVariant && product.variants?.length > 0) {
      alert('Please select a product variant');
      return;
    }

    const checkoutItem = {
      item_id: selectedVariant?.item_id || product.variants?.[0]?.item_id,
      product_id: product.product_id,
      product_name: product.product_name,
      image_url: product.images?.[0] || product.image,
      color: selectedVariant?.color || '',
      type: selectedVariant?.type || '',
      price: selectedVariant?.price || product.min_price || product.price,
      quantity: quantity,
      shop: {
        shop_id: product.shop_id,
        shop_name: product.shop_name
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

  if (loading) {
    return (
      <div style={{ ...styles.page, justifyContent: 'center', alignItems: 'center', minHeight: '50vh', display: 'flex' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ ...styles.page, justifyContent: 'center', alignItems: 'center', minHeight: '50vh', display: 'flex' }}>
        <h2>Error: {error || 'Product not found'}</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link to="/" style={styles.breadcrumbLink}>Home</Link>
        <span> › </span>
        <Link to="/" style={styles.breadcrumbLink}>{product.category || 'Products'}</Link>
        <span> › </span>
        <span style={{ color: '#3C433B' }}>{product.name ? product.name.substring(0, 50) : 'Product'}...</span>
      </nav>

      <div style={styles.container}>
        {/* Product Main Section */}
        <div style={styles.productSection}>
          {/* Image Gallery */}
          <div style={styles.imageGallery}>
            <img
              src={product.images?.[selectedImage] || product.images?.[0] || 'https://placehold.co/400x400/C5EFCB/647A67?text=Product'}
              alt={product.name}
              style={styles.mainImage}
            />
            <div style={styles.thumbnails}>
              {(product.images || []).map((img, idx) => (
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
                <strong>{(product.reviewCount || 0).toLocaleString()}</strong> Review
              </span>
              <span style={styles.divider}>|</span>
              <span style={styles.statsText}>
                <strong>{(product.sold || 0).toLocaleString()}</strong> Sold
              </span>
            </div>

            {/* Price Section */}
            <div style={styles.priceSection}>
              <div style={styles.priceRow}>
                <span style={styles.currentPrice}>{selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.price || 0)}</span>
              </div>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div style={styles.variantSection}>
                <div style={styles.variantLabel}>Item</div>
                <div style={styles.variantOptions}>
                  {product.variants.map((variant, idx) => (
                    <button
                      key={variant.item_id || idx}
                      style={{
                        ...styles.variantOption,
                        ...(selectedVariant?.item_id === variant.item_id ? styles.variantOptionActive : {})
                      }}
                      onClick={() => {
                        setSelectedVariant(variant);
                        // Change image when selecting variant
                        if (variant.image_url) {
                          const imgIndex = product.images.findIndex(img => img === variant.image_url);
                          if (imgIndex !== -1) {
                            setSelectedImage(imgIndex);
                          }
                        }
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#647A67'}
                      onMouseLeave={(e) => {
                        if (selectedVariant?.item_id !== variant.item_id) {
                          e.target.style.borderColor = '#e0e0e0';
                        }
                      }}
                    >
                      {variant.color} - {variant.type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={styles.quantitySection}>
              <span style={styles.quantityLabel}>Quantity</span>
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
              <span style={styles.stockText}>{selectedVariant?.stock || 0} products available</span>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button
                style={styles.addToCartBtn}
                onClick={handleAddToCart}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#B8D2B3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#C6DEC6'}
              >
                Add to Cart
              </button>
              <button
                style={styles.buyNowBtn}
                onClick={handleBuyNow}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
              >
                Buy Now
              </button>
            </div>

            {/* Guarantee Icons */}
            <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#758173' }}>
              <span>✓ Free 15-day returns</span>
              <span>✓ 100% Authentic Products</span>
              <span>✓ Free Shipping</span>
            </div>
          </div>
        </div>

        {/* Shop Section */}
        <div style={styles.shopSection}>
          <div style={styles.shopInfo}>
            <div style={{
              ...styles.shopAvatar,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              backgroundColor: '#C5EFCB'
            }}>🏪</div>
            <div style={styles.shopDetails}>
              <div style={styles.shopName}>{product.shop_name || 'Shop'}</div>
              <div style={styles.shopStatus}>Online</div>
              <div style={styles.shopButtons}>
                <button
                  style={styles.shopBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#C6DEC6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Chat Now
                </button>
                <Link
                  to={`/shop/${product.shop_id}`}
                  style={{ ...styles.shopBtn, textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#C6DEC6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  View Shop
                </Link>
              </div>
            </div>
          </div>
          <div style={styles.shopStats}>
            <div style={styles.shopStat}>
              <div style={styles.shopStatLabel}>Rating</div>
              <div style={styles.shopStatValue}>{product.shop_rating || 5}★</div>
            </div>
            <div style={styles.shopStat}>
              <div style={styles.shopStatLabel}>Status</div>
              <div style={styles.shopStatValue}>{product.shop_status || 'Active'}</div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div style={styles.descriptionSection}>
          <h2 style={styles.sectionTitle}>Product Description</h2>
          <div style={styles.descriptionContent}>
            {product.description || 'No description available'}
          </div>
        </div>

        {/* Product Reviews */}
        <div style={styles.reviewSection}>
          <h2 style={styles.sectionTitle}>Product Reviews</h2>
          
          {/* Review Header with Rating Overview */}
          <div style={styles.reviewHeader}>
            {/* Rating Overview */}
            <div style={styles.reviewOverview}>
              <div style={styles.reviewBigRating}>{avgRating}</div>
              <div style={styles.reviewStarsLarge}>
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <div style={styles.reviewTotalCount}>{reviews.length} reviews</div>
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
                { key: 'all', label: 'All' },
                { key: '5', label: '5 Stars' },
                { key: '4', label: '4 Stars' },
                { key: '3', label: '3 Stars' },
                { key: '2', label: '2 Stars' },
                { key: '1', label: '1 Star' },
                { key: 'hasImage', label: 'With Images' }
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
                <p>{reviewFilter !== 'all' ? 'No reviews for this filter' : 'No reviews yet'}</p>
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
                        {review.is_anonymous ? 'Anonymous Customer' : review.customer_name}
                      </div>
                      <div style={styles.reviewStars}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <div style={styles.reviewDate}>
                      {new Date(review.review_date).toLocaleDateString('en-US')}
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
                          quality: 'Good Quality',
                          color: 'Nice Color',
                          size: 'Fits Well',
                          delivery: 'Fast Delivery'
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
      </div>
    </div>
  );
};

export default ProductDetailPage;
