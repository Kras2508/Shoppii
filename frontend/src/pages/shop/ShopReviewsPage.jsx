import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import shopStyles from './shopStyles';

const ShopReviewsPage = () => {
  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1
  const [filterStatus, setFilterStatus] = useState('all'); // all, replied, pending
  const [searchTerm, setSearchTerm] = useState('');

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      order_id: 1001,
      product_id: 1,
      product_name: 'Áo thun nam cotton cao cấp',
      product_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
      customer_name: 'Nguyễn Văn A',
      customer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NVA',
      rating: 5,
      comment: 'Sản phẩm rất tốt, chất lượng vải mềm mại, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau!',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&h=200&fit=crop'
      ],
      created_at: '2024-12-02',
      replied: true,
      reply: 'Cảm ơn bạn đã ủng hộ shop! Rất vui vì bạn hài lòng với sản phẩm. Hẹn gặp lại bạn! 💚',
      reply_date: '2024-12-02'
    },
    {
      id: 2,
      order_id: 1002,
      product_id: 2,
      product_name: 'Quần jean nam slim fit',
      product_image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=100&h=100&fit=crop',
      customer_name: 'Trần Thị B',
      customer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TTB',
      rating: 4,
      comment: 'Quần đẹp, form chuẩn. Tuy nhiên màu hơi đậm hơn so với hình ảnh một chút. Nhìn chung vẫn hài lòng.',
      images: [],
      created_at: '2024-12-01',
      replied: false,
      reply: '',
      reply_date: null
    },
    {
      id: 3,
      order_id: 1003,
      product_id: 3,
      product_name: 'Giày thể thao sneaker',
      product_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      customer_name: 'Lê Văn C',
      customer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LVC',
      rating: 5,
      comment: 'Giày rất êm, đi cả ngày không mỏi chân. Thiết kế đẹp, phối đồ dễ dàng.',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'
      ],
      created_at: '2024-11-30',
      replied: true,
      reply: 'Cảm ơn bạn đã tin tưởng và đánh giá! Shop rất vui khi sản phẩm làm hài lòng bạn ạ! 🎉',
      reply_date: '2024-11-30'
    },
    {
      id: 4,
      order_id: 1004,
      product_id: 4,
      product_name: 'Váy midi hoa nhí',
      product_image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&h=100&fit=crop',
      customer_name: 'Phạm Thị D',
      customer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PTD',
      rating: 3,
      comment: 'Váy đẹp nhưng size hơi nhỏ so với bảng size. Nên order lớn hơn 1 size.',
      images: [],
      created_at: '2024-11-29',
      replied: false,
      reply: '',
      reply_date: null
    },
    {
      id: 5,
      order_id: 1005,
      product_id: 1,
      product_name: 'Áo thun nam cotton cao cấp',
      product_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
      customer_name: 'Hoàng Văn E',
      customer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HVE',
      rating: 2,
      comment: 'Chất lượng không như mong đợi. Vải mỏng và nhanh nhão sau khi giặt.',
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&h=200&fit=crop'
      ],
      created_at: '2024-11-28',
      replied: true,
      reply: 'Shop xin lỗi vì trải nghiệm không tốt của bạn. Shop sẽ liên hệ để hỗ trợ đổi trả ạ. Mong bạn cho shop cơ hội phục vụ tốt hơn! 🙏',
      reply_date: '2024-11-28'
    },
    {
      id: 6,
      order_id: 1006,
      product_id: 5,
      product_name: 'Áo sơ mi công sở',
      product_image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop',
      customer_name: 'Ngô Thị F',
      customer_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NTF',
      rating: 5,
      comment: 'Áo đẹp lắm, vải mát mặc đi làm rất thoải mái. Shop tư vấn nhiệt tình. 10 điểm!',
      images: [],
      created_at: '2024-11-27',
      replied: false,
      reply: '',
      reply_date: null
    }
  ];

  // Stats
  const stats = {
    total: reviews.length,
    average: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    pending: reviews.filter(r => !r.replied).length,
    replied: reviews.filter(r => r.replied).length,
    byRating: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    }
  };

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const styles = {
    ...shopStyles,
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    statBox: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#647A67',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '13px',
      color: '#666'
    },
    filterBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    filterGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    filterLabel: {
      fontSize: '14px',
      color: '#666',
      fontWeight: '500'
    },
    filterBtn: {
      padding: '8px 14px',
      fontSize: '13px',
      border: '1px solid #ddd',
      borderRadius: '20px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    filterBtnActive: {
      backgroundColor: '#647A67',
      color: 'white',
      borderColor: '#647A67'
    },
    searchInput: {
      padding: '10px 16px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      width: '300px',
      outline: 'none'
    },
    reviewCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    customerInfo: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    customerAvatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      objectFit: 'cover'
    },
    customerName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1F241F',
      marginBottom: '4px'
    },
    reviewDate: {
      fontSize: '12px',
      color: '#999'
    },
    stars: {
      display: 'flex',
      gap: '2px'
    },
    star: {
      fontSize: '16px'
    },
    productInfo: {
      display: 'flex',
      gap: '12px',
      padding: '12px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      marginBottom: '12px'
    },
    productImage: {
      width: '60px',
      height: '60px',
      borderRadius: '6px',
      objectFit: 'cover'
    },
    productName: {
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    orderId: {
      fontSize: '12px',
      color: '#999',
      marginTop: '4px'
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
      marginBottom: '12px'
    },
    reviewImage: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover',
      cursor: 'pointer',
      transition: 'transform 0.2s'
    },
    replySection: {
      backgroundColor: '#f0f7f1',
      borderRadius: '8px',
      padding: '14px',
      marginTop: '12px',
      borderLeft: '3px solid #647A67'
    },
    replyHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#647A67'
    },
    replyText: {
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.5'
    },
    replyDate: {
      fontSize: '11px',
      color: '#888',
      marginTop: '8px'
    },
    replyForm: {
      marginTop: '12px',
      padding: '16px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    },
    replyTextarea: {
      width: '100%',
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    replyActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '12px',
      justifyContent: 'flex-end'
    },
    actionBtn: {
      padding: '6px 12px',
      fontSize: '13px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      border: 'none',
      transition: 'all 0.2s'
    },
    pendingBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    repliedBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    ratingBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px'
    },
    ratingLabel: {
      fontSize: '13px',
      color: '#666',
      width: '50px'
    },
    ratingProgress: {
      flex: 1,
      height: '8px',
      backgroundColor: '#eee',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    ratingFill: {
      height: '100%',
      backgroundColor: '#FFD700',
      borderRadius: '4px'
    },
    ratingCount: {
      fontSize: '13px',
      color: '#888',
      width: '30px',
      textAlign: 'right'
    },
    imageModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      cursor: 'pointer'
    },
    modalImage: {
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
      borderRadius: '8px'
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ ...styles.star, color: i < rating ? '#FFD700' : '#ddd' }}>
        ★
      </span>
    ));
  };

  const handleReply = (reviewId) => {
    if (replyText.trim()) {
      // In real app, call API to save reply
      alert('Đã gửi phản hồi!');
      setReplyingTo(null);
      setReplyText('');
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) return false;
    if (filterStatus === 'replied' && !review.replied) return false;
    if (filterStatus === 'pending' && review.replied) return false;
    if (searchTerm && !review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) 
        && !review.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
        && !review.comment.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>⭐ Đánh giá từ khách hàng</h1>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Tổng đánh giá</div>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statNumber, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              {stats.average} <span style={{ fontSize: '20px', color: '#FFD700' }}>★</span>
            </div>
            <div style={styles.statLabel}>Điểm trung bình</div>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statNumber, color: '#e67e22' }}>{stats.pending}</div>
            <div style={styles.statLabel}>Chờ phản hồi</div>
          </div>
          <div style={styles.statBox}>
            <div style={{ ...styles.statNumber, color: '#27ae60' }}>{stats.replied}</div>
            <div style={styles.statLabel}>Đã phản hồi</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div style={{ ...styles.card, marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>📊 Phân bố đánh giá</h3>
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} style={styles.ratingBar}>
              <span style={styles.ratingLabel}>{rating} sao</span>
              <div style={styles.ratingProgress}>
                <div style={{ 
                  ...styles.ratingFill, 
                  width: `${stats.total > 0 ? (stats.byRating[rating] / stats.total) * 100 : 0}%` 
                }} />
              </div>
              <span style={styles.ratingCount}>{stats.byRating[rating]}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="🔍 Tìm theo sản phẩm, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sao:</span>
            {['all', '5', '4', '3', '2', '1'].map(rating => (
              <button
                key={rating}
                style={{
                  ...styles.filterBtn,
                  ...(filterRating === rating ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilterRating(rating)}
              >
                {rating === 'all' ? 'Tất cả' : `${rating}★`}
              </button>
            ))}
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Trạng thái:</span>
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'pending', label: '⏳ Chờ phản hồi' },
              { value: 'replied', label: '✓ Đã phản hồi' }
            ].map(status => (
              <button
                key={status.value}
                style={{
                  ...styles.filterBtn,
                  ...(filterStatus === status.value ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilterStatus(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <div style={{ fontSize: '16px', color: '#666' }}>Không có đánh giá nào phù hợp</div>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              {/* Header */}
              <div style={styles.reviewHeader}>
                <div style={styles.customerInfo}>
                  <img src={review.customer_avatar} alt="" style={styles.customerAvatar} />
                  <div>
                    <div style={styles.customerName}>{review.customer_name}</div>
                    <div style={styles.stars}>{renderStars(review.rating)}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={styles.reviewDate}>{review.created_at}</div>
                  {review.replied ? (
                    <span style={styles.repliedBadge}>✓ Đã phản hồi</span>
                  ) : (
                    <span style={styles.pendingBadge}>⏳ Chờ phản hồi</span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div style={styles.productInfo}>
                <img src={review.product_image} alt="" style={styles.productImage} />
                <div>
                  <div style={styles.productName}>{review.product_name}</div>
                  <div style={styles.orderId}>Đơn hàng: #{review.order_id}</div>
                </div>
              </div>

              {/* Comment */}
              <div style={styles.reviewComment}>{review.comment}</div>

              {/* Images */}
              {review.images.length > 0 && (
                <div style={styles.reviewImages}>
                  {review.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="" 
                      style={styles.reviewImage}
                      onClick={() => setSelectedImage(img)}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              )}

              {/* Reply Section */}
              {review.replied && (
                <div style={styles.replySection}>
                  <div style={styles.replyHeader}>
                    <span>🏪</span> Phản hồi của Shop
                  </div>
                  <div style={styles.replyText}>{review.reply}</div>
                  <div style={styles.replyDate}>Đã phản hồi: {review.reply_date}</div>
                </div>
              )}

              {/* Reply Form */}
              {!review.replied && replyingTo !== review.id && (
                <button
                  style={{
                    ...styles.actionBtn,
                    backgroundColor: '#647A67',
                    color: 'white',
                    marginTop: '12px'
                  }}
                  onClick={() => setReplyingTo(review.id)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
                >
                  💬 Phản hồi
                </button>
              )}

              {replyingTo === review.id && (
                <div style={styles.replyForm}>
                  <textarea
                    placeholder="Nhập phản hồi của bạn..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={styles.replyTextarea}
                  />
                  <div style={styles.replyActions}>
                    <button
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: '#f0f0f0',
                        color: '#666'
                      }}
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: '#647A67',
                        color: 'white'
                      }}
                      onClick={() => handleReply(review.id)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
                    >
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div style={styles.imageModal} onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="" style={styles.modalImage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopReviewsPage;
