import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StarRating from './review/StarRating';
import ImageUploader from './review/ImageUploader';
import reviewStyles from './review/reviewStyles';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { orderId, itemId } = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Mock order item data
  const [orderItem] = useState({
    order_id: orderId || 1001,
    order_item_id: itemId || 1,
    product_id: 1,
    product_name: 'Áo thun nam cotton cao cấp Premium',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
    color: 'Trắng',
    type: 'L',
    quantity: 2,
    price: 129000,
    shop_id: 1,
    shop_name: 'Cửa hàng Kim Tín'
  });

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
      alert('Vui lòng chọn đánh giá sao');
      return;
    }

    if (productReview.trim().length < 10) {
      alert('Vui lòng viết tối thiểu 10 ký tự cho đánh giá');
      return;
    }

    const reviewData = {
      order_id: orderItem.order_id,
      order_item_id: orderItem.order_item_id,
      product_id: orderItem.product_id,
      shop_id: orderItem.shop_id,
      rating,
      comment: productReview,
      images: images.map(img => img.src),
      attributes: Object.keys(attributes).filter(key => attributes[key]),
      is_anonymous: isAnonymous,
      created_at: new Date().toISOString()
    };

    console.log('Review data:', reviewData);
    setSubmitted(true);

    setTimeout(() => {
      navigate(`/order/${orderItem.order_id}`);
    }, 2000);
  };

  const handleCancel = () => {
    if (productReview.trim() && !window.confirm('Bạn chắc muốn hủy? Đánh giá của bạn sẽ không được lưu.')) {
      return;
    }
    navigate(`/order/${orderItem.order_id}`);
  };

  return (
    <div style={reviewStyles.container}>
      {/* Header */}
      <div style={reviewStyles.header}>
        <button
          style={reviewStyles.backBtn}
          onClick={handleCancel}
        >
          ← Quay lại
        </button>
        <h1 style={reviewStyles.pageTitle}>Đánh giá sản phẩm</h1>
      </div>

      {/* Success Message */}
      {submitted && (
        <div style={reviewStyles.successMessage}>
          <span style={reviewStyles.successIcon}>✅</span>
          Cảm ơn bạn đã đánh giá! Đang quay lại trang đơn hàng...
        </div>
      )}

      {/* Product Info */}
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
              ✍️ Nhận xét của bạn (tối thiểu 10 ký tự)
            </div>
            <textarea
              style={reviewStyles.textarea}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này. Những nhận xét chi tiết sẽ giúp người khác hiểu hơn về sản phẩm."
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
            <div style={reviewStyles.optionsTitle}>Những điều bạn thích</div>
            <div style={reviewStyles.checkboxGroup}>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.quality}
                  onChange={() => handleAttributeChange('quality')}
                />
                <span style={reviewStyles.checkboxLabel}>✅ Chất lượng tốt</span>
              </label>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.color}
                  onChange={() => handleAttributeChange('color')}
                />
                <span style={reviewStyles.checkboxLabel}>🎨 Màu sắc đẹp</span>
              </label>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.size}
                  onChange={() => handleAttributeChange('size')}
                />
                <span style={reviewStyles.checkboxLabel}>📏 Vừa vặn</span>
              </label>
              <label style={reviewStyles.checkboxItem}>
                <input
                  type="checkbox"
                  style={reviewStyles.checkbox}
                  checked={attributes.delivery}
                  onChange={() => handleAttributeChange('delivery')}
                />
                <span style={reviewStyles.checkboxLabel}>🚚 Giao hàng nhanh</span>
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
              Ẩn danh (tên bạn sẽ không hiển thị)
            </span>
          </label>

          {/* Actions */}
          <div style={reviewStyles.actions}>
            <button
              type="button"
              style={reviewStyles.cancelBtn}
              onClick={handleCancel}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                ...reviewStyles.submitBtn,
                ...(rating === 0 || productReview.length < 10 ? reviewStyles.submitBtnDisabled : {})
              }}
              disabled={rating === 0 || productReview.length < 10}
            >
              📤 Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
