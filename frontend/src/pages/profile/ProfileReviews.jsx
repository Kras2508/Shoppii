import React, { useState, useEffect } from 'react';
import { reviewService } from '../../api/reviewService';

const ProfileReviews = ({ styles, privateClient }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filter, setFilter] = useState('all'); // all, Product, Shop

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, filter]);

  const fetchReviews = async () => {
    if (!privateClient) return;
    
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 10
      };
      
      // If filter is not 'all', add target_type to params
      if (filter !== 'all') {
        params.target_type = filter;
      }
      
      const response = await reviewService.getMyReviews(privateClient, params);
      
      if (response.data?.data) {
        setReviews(response.data.data.reviews || []);
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }));
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.target_type === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewService.deleteReview(reviewId, privateClient);
      setReviews(prev => prev.filter(r => r.review_id !== reviewId));
      alert('Review deleted successfully!');
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Cannot delete review. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div style={filterStyles.container}>
        <button
          style={{
            ...filterStyles.button,
            ...(filter === 'all' ? filterStyles.buttonActive : {})
          }}
          onClick={() => setFilter('all')}
        >
          All ({reviews.length})
        </button>
        <button
          style={{
            ...filterStyles.button,
            ...(filter === 'Product' ? filterStyles.buttonActive : {})
          }}
          onClick={() => setFilter('Product')}
        >
          Product ({reviews.filter(r => r.target_type === 'Product').length})
        </button>
        <button
          style={{
            ...filterStyles.button,
            ...(filter === 'Shop' ? filterStyles.buttonActive : {})
          }}
          onClick={() => setFilter('Shop')}
        >
          Shop ({reviews.filter(r => r.target_type === 'Shop').length})
        </button>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div style={emptyStyles.container}>
          <div style={emptyStyles.icon}>📝</div>
          <div style={emptyStyles.text}>You have no reviews yet</div>
          <div style={emptyStyles.subText}>
            Please make a purchase and leave a review for the product!
          </div>
        </div>
      ) : (
        <div style={reviewListStyles.container}>
          {filteredReviews.map(review => (
            <div key={review.review_id} style={reviewCardStyles.card}>
              <div style={reviewCardStyles.header}>
                <div style={reviewCardStyles.targetInfo}>
                  <span style={reviewCardStyles.targetType}>
                    {review.target_type === 'Product' ? '📦' : '🏪'}
                    {review.target_type === 'Product' ? ' Sản phẩm' : ' Shop'}
                  </span>
                  <span style={reviewCardStyles.targetName}>
                    {review.target_name || `ID: ${review.target_id}`}
                  </span>
                </div>
                <span style={reviewCardStyles.date}>
                  {formatDate(review.review_date)}
                </span>
              </div>

              <div style={reviewCardStyles.rating}>
                <span style={reviewCardStyles.stars}>{renderStars(review.rating)}</span>
                <span style={reviewCardStyles.ratingText}>({review.rating}/5)</span>
              </div>

              <div style={reviewCardStyles.comment}>
                {review.comment}
              </div>

              {review.image_url && (
                <div style={reviewCardStyles.imageContainer}>
                  <img 
                    src={review.image_url} 
                    alt="Review" 
                    style={reviewCardStyles.image}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              <div style={reviewCardStyles.actions}>
                <button
                  style={reviewCardStyles.deleteBtn}
                  onClick={() => handleDeleteReview(review.review_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={paginationStyles.container}>
          <button
            style={{
              ...paginationStyles.button,
              ...(pagination.page === 1 ? paginationStyles.buttonDisabled : {})
            }}
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            ← Trước
          </button>
          <span style={paginationStyles.info}>
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button
            style={{
              ...paginationStyles.button,
              ...(pagination.page === pagination.totalPages ? paginationStyles.buttonDisabled : {})
            }}
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// Styles
const filterStyles = {
  container: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '8px 16px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ddd',
    borderRadius: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  buttonActive: {
    backgroundColor: '#647A67',
    color: '#fff',
    borderColor: '#647A67'
  }
};

const emptyStyles = {
  container: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  text: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  },
  subText: {
    fontSize: '14px',
    color: '#666'
  }
};

const reviewListStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }
};

const reviewCardStyles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '20px',
    transition: 'box-shadow 0.2s'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  targetInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  targetType: {
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase'
  },
  targetName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  date: {
    fontSize: '13px',
    color: '#999'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  stars: {
    fontSize: '18px',
    letterSpacing: '2px'
  },
  ratingText: {
    fontSize: '14px',
    color: '#666'
  },
  comment: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.6',
    marginBottom: '12px'
  },
  imageContainer: {
    marginBottom: '12px'
  },
  image: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '12px',
    marginTop: '8px'
  },
  deleteBtn: {
    padding: '6px 12px',
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.2s'
  }
};

const paginationStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #eee'
  },
  button: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px'
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  info: {
    fontSize: '14px',
    color: '#666'
  }
};

export default ProfileReviews;
