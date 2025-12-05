import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminStyles from './adminStyles.js';
import { adminService } from '../../api/adminService.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import createPrivateClient from '../../clients/private.client';

const AdminReviewsPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllReviews(privateClient, {
          search: searchTerm || undefined
        });
        if (response.data?.data?.reviews) {
          setReviews(response.data.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReviews();
    }
  }, [token, searchTerm]);

  const filteredReviews = reviews.filter(review => {
    const matchSearch = 
      review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    return matchSearch && matchStatus && matchRating;
  });

  const handleHideReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: 'Hidden', hidden_reason: 'Bị ẩn bởi Admin' } : review
    ));
  };

  const handleApproveReview = (reviewId) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: 'Active', report_count: 0, report_reason: null } : review
    ));
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa review này?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    }
  };

  const styles = {
    ...adminStyles,
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    filterRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minWidth: '150px',
      outline: 'none',
      cursor: 'pointer'
    },
    reviewCard: {
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '10px',
      border: '1px solid #eee',
      marginBottom: '12px'
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    customerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    stars: {
      color: '#f39c12',
      fontSize: '14px'
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Reported': return 'warning';
      case 'Hidden': return 'danger';
      default: return 'secondary';
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={adminStyles.pageTitle}>Quản lý Đánh giá</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Tổng: <strong>{reviews.length}</strong> đánh giá
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #3498db' }}>
          <div>
            <div style={adminStyles.statLabel}>Tổng đánh giá</div>
            <div style={adminStyles.statValue}>{reviews.length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>⭐</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #2ecc71' }}>
          <div>
            <div style={adminStyles.statLabel}>Đánh giá tốt (4-5 sao)</div>
            <div style={adminStyles.statValue}>{reviews.filter(r => r.rating >= 4).length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>😊</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #f39c12' }}>
          <div>
            <div style={adminStyles.statLabel}>Bị báo cáo</div>
            <div style={adminStyles.statValue}>{reviews.filter(r => r.status === 'Reported').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>⚠️</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #e74c3c' }}>
          <div>
            <div style={adminStyles.statLabel}>Đã ẩn</div>
            <div style={adminStyles.statValue}>{reviews.filter(r => r.status === 'Hidden').length}</div>
          </div>
          <span style={{ fontSize: '32px' }}>🚫</span>
        </div>
      </div>

      {/* Main Card */}
      <div style={adminStyles.card}>
        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <Input
              placeholder="🔍 Tìm kiếm theo nội dung, sản phẩm, shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Đang hiển thị</option>
            <option value="Reported">Bị báo cáo</option>
            <option value="Hidden">Đã ẩn</option>
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>

        {/* Review List */}
        {filteredReviews.map(review => {
          return (
            <div key={review.id} style={{
              ...styles.reviewCard,
              borderLeftColor: review.status === 'Reported' ? '#f39c12' : review.status === 'Hidden' ? '#e74c3c' : '#eee',
              borderLeftWidth: review.status !== 'Active' ? '4px' : '1px'
            }}>
              <div style={styles.reviewHeader}>
                <div style={styles.customerInfo}>
                  <Avatar name={review.customer_name} size="medium" />
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{review.customer_name}</div>
                    <div style={styles.stars}>{renderStars(review.rating)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant={getStatusBadgeVariant(review.status)} size="small">
                    {review.status}
                  </Badge>
                  {review.report_count > 0 && (
                    <Badge variant="danger" size="small">
                      {review.report_count} báo cáo
                    </Badge>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  📦 {review.product_name} • 🏪 {review.shop_name}
                </div>
                <p style={{ margin: '8px 0', fontSize: '14px', lineHeight: '1.5', color: '#333' }}>
                  "{review.comment}"
                </p>
              </div>

              {review.report_reason && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#856404',
                  marginBottom: '12px'
                }}>
                  <strong>⚠️ Lý do báo cáo:</strong> {review.report_reason}
                </div>
              )}

              {review.hidden_reason && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#721c24',
                  marginBottom: '12px'
                }}>
                  <strong>🚫 Lý do ẩn:</strong> {review.hidden_reason}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>{review.created_at}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => { setSelectedReview(review); setShowModal(true); }}
                  >
                    👁️ Xem
                  </Button>
                  {review.status === 'Reported' && (
                    <>
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => handleApproveReview(review.id)}
                      >
                        ✓ Duyệt
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleHideReview(review.id)}
                      >
                        🚫 Ẩn
                      </Button>
                    </>
                  )}
                  {review.status === 'Active' && (
                    <Button
                      variant="warning"
                      size="small"
                      onClick={() => handleHideReview(review.id)}
                    >
                      🚫 Ẩn
                    </Button>
                  )}
                  {review.status === 'Hidden' && (
                    <Button
                      variant="success"
                      size="small"
                      onClick={() => handleApproveReview(review.id)}
                    >
                      ✓ Hiện lại
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    🗑️ Xóa
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReviews.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Không tìm thấy đánh giá nào
          </div>
        )}
      </div>

      {/* Review Detail Modal */}
      {showModal && selectedReview && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Chi tiết Đánh giá"
          size="medium"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
              {selectedReview.status === 'Reported' && (
                <>
                  <Button
                    variant="success"
                    icon="✓"
                    onClick={() => { handleApproveReview(selectedReview.id); setShowModal(false); }}
                  >
                    Duyệt review
                  </Button>
                  <Button
                    variant="danger"
                    icon="🚫"
                    onClick={() => { handleHideReview(selectedReview.id); setShowModal(false); }}
                  >
                    Ẩn review
                  </Button>
                </>
              )}
              {selectedReview.status === 'Hidden' && (
                <Button
                  variant="success"
                  icon="✓"
                onClick={() => { handleApproveReview(selectedReview.id); setShowModal(false); }}
              >
                Hiện lại review
              </Button>
            )}
          </div>
        }
      >
        <>
          {/* Customer Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <Avatar name={selectedReview.customer_name} size="large" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>{selectedReview.customer_name}</div>
                <div style={{ ...styles.stars, fontSize: '18px' }}>{renderStars(selectedReview.rating)}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{selectedReview.created_at}</div>
              </div>
              <Badge variant={getStatusBadgeVariant(selectedReview.status)}>
                {selectedReview.status}
              </Badge>
            </div>

            {/* Product & Shop */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Sản phẩm</div>
                <div style={{ fontWeight: '500' }}>📦 {selectedReview.product_name}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Shop</div>
                <div style={{ fontWeight: '500' }}>🏪 {selectedReview.shop_name}</div>
              </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Nội dung đánh giá</div>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '15px',
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}>
                "{selectedReview.comment}"
              </div>
            </div>

            {/* Report Info */}
            {selectedReview.report_reason && (
              <div style={{
                padding: '16px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: '600', color: '#856404', marginBottom: '8px' }}>
                  ⚠️ Thông tin báo cáo ({selectedReview.report_count} báo cáo)
                </div>
                <div style={{ color: '#856404' }}>{selectedReview.report_reason}</div>
              </div>
            )}

            {selectedReview.hidden_reason && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f8d7da',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontWeight: '600', color: '#721c24', marginBottom: '8px' }}>
                  🚫 Lý do ẩn
                </div>
                <div style={{ color: '#721c24' }}>{selectedReview.hidden_reason}</div>
              </div>
            )}
          </>
        </Modal>
      )}
    </div>
  );
};

export default AdminReviewsPage;
