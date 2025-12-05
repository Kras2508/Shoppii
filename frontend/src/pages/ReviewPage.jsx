import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StarRating from './review/StarRating';
import ImageUploader from './review/ImageUploader';
import reviewStyles from './review/reviewStyles';
import { reviewService } from '../api/reviewService';
import { orderService } from '../api/orderService';
import createPrivateClient from '../clients/private.client';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { orderId, itemId } = useParams();
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  // Order item state
  const [orderItem, setOrderItem] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [rating, setRating] = useState(0);
  const [productReview, setProductReview] = useState('');
  const [images, setImages] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attributes, setAttributes] = useState({
    quality: false,
    color: false,
    size: false,
    delivery: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch order item details
  useEffect(() => {
    if (!isAuthenticated || !orderId) {
      return;
    }

    const fetchOrderItem = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrderById(orderId, privateClient);
        if (response.data?.data?.items) {
          setOrderItems(response.data.data.items);
          
          // If itemId is provided, find that specific item
          if (itemId) {
            const item = response.data.data.items.find(i => i.order_item_id == itemId);
            if (item) {
              setOrderItem({
                order_id: orderId,
                order_item_id: item.order_item_id,
                product_id: item.product_id,
                product_name: item.product_name,
                image_url: item.variant_image || item.product_image,
                color: item.color,
                type: item.type,
                quantity: item.quantity,
                price: item.price_at_purchase,
                shop_id: item.shop_id,
                shop_name: item.shop_name
              });
            }
          } else if (response.data.data.items.length > 0) {
            // If no itemId, default to first item
            const item = response.data.data.items[0];
            setOrderItem({
              order_id: orderId,
              order_item_id: item.order_item_id,
              product_id: item.product_id,
              product_name: item.product_name,
              image_url: item.variant_image || item.product_image,
              color: item.color,
              type: item.type,
              quantity: item.quantity,
              price: item.price_at_purchase,
              shop_id: item.shop_id,
              shop_name: item.shop_name
            });
          }
        }
      } catch (err) {
        console.error('Error fetching order item:', err);
        setError('Cannot load order item. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItem();
  }, [orderId, itemId, isAuthenticated]);

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const handleAttributeChange = (key) => {
    setAttributes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a star rating');
      return;
    }

    if (productReview.trim().length < 5) {
      alert('Please write at least 5 characters for the review');
      return;
    }

    submitReview();
  };

  const submitReview = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      if (!orderItem) {
        setError('Vui lòng chọn sản phẩm để review');
        setIsSubmitting(false);
        return;
      }

      // Backend expects target_type and target_id
      // We can review both Product and Shop
      // For now, we'll review the Product
      const reviewData = {
        target_type: 'Product',
        target_id: orderItem.product_id,
        rating,
        comment: productReview,
        image_url: images.length > 0 ? images[0].src : null
      };

      console.log('📝 Submitting review:', reviewData);

      await reviewService.createReview(reviewData, privateClient);

      console.log('✅ Review submitted successfully');
      setSubmitted(true);

      setTimeout(() => {
        navigate(`/order/${orderId}`);
      }, 2000);
    } catch (err) {
      console.error('❌ Error submitting review:', err);
      setError('Cannot submit review. Please try again later.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (productReview.trim() && !window.confirm('Are you sure you want to cancel? Your review will not be saved.')) {
      return;
    }
    navigate(`/order/${orderId}`);
  };

  return (
    <div style={reviewStyles.container}>
      {/* Header */}
      <div style={reviewStyles.header}>
        <button
          style={reviewStyles.backBtn}
          onClick={handleCancel}
        >
          ← Back
        </button>
        <h1 style={reviewStyles.pageTitle}>Product Review</h1>
      </div>

      {/* Success Message */}
      {submitted && (
        <div style={reviewStyles.successMessage}>
          <span style={reviewStyles.successIcon}>✅</span>
          Thank you for your review! Redirecting to order page...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          ...reviewStyles.successMessage,
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderColor: '#ef5350'
        }}>
          <span style={{...reviewStyles.successIcon, marginRight: '10px'}}>❌</span>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={reviewStyles.card}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading product information...</p>
          </div>
        </div>
      )}

      {/* Item Selector (if multiple items) */}
      {!loading && orderItems.length > 1 && !itemId && (
        <div style={reviewStyles.card}>
          <div style={reviewStyles.cardTitle}>Select a product to review</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {orderItems.map(item => (
              <button
                key={item.order_item_id}
                style={{
                  padding: '12px 16px',
                  border: orderItem?.order_item_id === item.order_item_id ? '2px solid #647A67' : '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: orderItem?.order_item_id === item.order_item_id ? '#f0f4f2' : '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333'
                }}
                onClick={() => {
                  setOrderItem({
                    order_id: orderId,
                    order_item_id: item.order_item_id,
                    product_id: item.product_id,
                    product_name: item.product_name,
                    image_url: item.variant_image || item.product_image,
                    color: item.color,
                    type: item.type,
                    quantity: item.quantity,
                    price: item.price_at_purchase,
                    shop_id: item.shop_id,
                    shop_name: item.shop_name
                  });
                  // Reset form
                  setRating(0);
                  setProductReview('');
                  setImages([]);
                }}
              >
                {item.product_name}{item.color ? ` (${item.color}${item.type ? ', ' + item.type : ''})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Info */}
      {!loading && orderItem && (
      <div style={reviewStyles.card}>
        <div style={reviewStyles.productInfo}>
          <img
            src={orderItem.image_url}
            alt={orderItem.product_name}
            style={reviewStyles.productImage}
          />
          <div style={reviewStyles.productDetails}>
            <div style={reviewStyles.productName}>{orderItem.product_name}</div>
            <div style={reviewStyles.productVariant}>
              {orderItem.color}{orderItem.type ? `, ${orderItem.type}` : ''} | x{orderItem.quantity}
            </div>
            <div style={reviewStyles.productPrice}>
              {orderItem.price.toLocaleString('vi-VN')}đ
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <StarRating
            rating={rating}
            setRating={setRating}
            styles={reviewStyles}
          />

          {/* Review Text */}
          <div style={reviewStyles.reviewSection}>
            <div style={reviewStyles.reviewLabel}>
              ✍️ Your review (minimum 5 characters)
            </div>
            <textarea
              style={reviewStyles.textarea}
              placeholder="Share your thoughts about this product. Detailed reviews help others understand the product better."
              value={productReview}
              onChange={(e) => setProductReview(e.target.value.slice(0, 500))}
              onFocus={(e) => e.target.style.borderColor = '#647A67'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <div style={reviewStyles.charCount}>
              {productReview.length}/500
            </div>
          </div>

          {/* Attributes */}
          <div style={reviewStyles.optionsSection}>
            <div style={reviewStyles.optionsTitle}>What you liked</div>
            <div style={reviewStyles.checkboxGroup}>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.quality}
                  onChange={() => handleAttributeChange('quality')}
                />
                <span style={reviewStyles.checkboxLabel}>Good quality</span>
              </label>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.color}
                  onChange={() => handleAttributeChange('color')}
                />
                <span style={reviewStyles.checkboxLabel}>Nice color</span>
              </label>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.size}
                  onChange={() => handleAttributeChange('size')}
                />
                <span style={reviewStyles.checkboxLabel}>Just right</span>
              </label>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.delivery}
                  onChange={() => handleAttributeChange('delivery')}
                />
                <span style={reviewStyles.checkboxLabel}>Fast delivery</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <ImageUploader
            images={images}
            setImages={setImages}
            styles={reviewStyles}
          />

          {/* Anonymous */}
          <label style={reviewStyles.anonymousSection}>
            <input
              type="checkbox"
              style={reviewStyles.anonymousCheckbox}
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span style={reviewStyles.anonymousLabel}>
              Anonymous (your name will not be displayed)
            </span>
          </label>

          {/* Actions */}
          <div style={reviewStyles.actions}>
            <button
              type="button"
              style={reviewStyles.cancelBtn}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...reviewStyles.submitBtn,
                ...(rating === 0 || productReview.length < 10 || isSubmitting ? reviewStyles.submitBtnDisabled : {})
              }}
              disabled={rating === 0 || productReview.length < 10 || isSubmitting}
            >
              {isSubmitting ? '⏳ Sending...' : '📤 Submit Review'}
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};

export default ReviewPage;
