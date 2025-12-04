import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { reviewService } from '../../api/reviewService';
import createPrivateClient from '../../clients/private.client';

const ShopReviewsPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [filterRating, setFilterRating] = useState('all'); // all, 5, 4, 3, 2, 1
  const [filterStatus, setFilterStatus] = useState('all'); // all, replied, pending
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const params = { target_type: 'Product' };
        if (filterRating !== 'all') {
          params.rating = filterRating;
        }
        const response = await reviewService.getReviews(params);
        if (response.data?.data?.reviews) {
          setReviews(response.data.data.reviews.map(r => ({
            id: r.review_id,
            order_id: r.order_id,
            product_id: r.target_id,
            product_name: r.product_name || 'Sản phẩm',
            product_image: r.product_image || 'https://via.placeholder.com/100',
            customer_name: r.customer_name || 'Khách hàng',
            customer_avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.customer_id}`,
            rating: r.rating,
            comment: r.comment,
            images: r.images || [],
            created_at: new Date(r.created_at).toLocaleDateString('vi-VN'),
            replied: !!r.reply,
            reply: r.reply || '',
            reply_date: r.reply_date ? new Date(r.reply_date).toLocaleDateString('vi-VN') : null
          })));
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Không thể tải danh sách đánh giá');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [filterRating, token]);

  // Stats
  const stats = {
    total: reviews.length,
    average: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0',
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
