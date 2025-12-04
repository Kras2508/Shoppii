import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OrderDetailTimeline from './order/OrderDetailTimeline';
import OrderDetailProducts from './order/OrderDetailProducts';
import OrderDetailSummary from './order/OrderDetailSummary';
import orderDetailStyles from './order/orderDetailStyles';
import { orderService } from '../api/orderService';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Get order from navigation state or fetch
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!order && id) {
      // Fetch order by ID from API
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const response = await orderService.getOrderById(id);
          if (response.data?.data) {
            setOrder(response.data.data);
          } else {
            setError('Order not found');
          }
        } catch (err) {
          console.error('Error fetching order:', err);
          setError('Unable to load order information');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order, isAuthenticated, navigate]);

  const formatPrice = (price) => {
    const value = Number(price ?? 0);
    return value.toLocaleString('en-US') + ' VND';
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing':
        return { ...orderDetailStyles.statusBadge, ...orderDetailStyles.statusProcessing };
      case 'Shipped':
        return { ...orderDetailStyles.statusBadge, ...orderDetailStyles.statusShipped };
      case 'Delivered':
        return { ...orderDetailStyles.statusBadge, ...orderDetailStyles.statusDelivered };
      case 'Cancelled':
        return { ...orderDetailStyles.statusBadge, ...orderDetailStyles.statusCancelled };
      default:
        return orderDetailStyles.statusBadge;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing': return 'Processing';
      case 'Shipped': return 'Shipped';
      case 'Delivered': return 'Delivered';
      case 'Cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderService.cancelOrder(order.order_id);
        alert('Order has been successfully cancelled!');
        setOrder(prev => ({ ...prev, status: 'Cancelled' }));
      } catch (err) {
        console.error('Error cancelling order:', err);
        alert('Unable to cancel order. Please try again!');
      }
    }
  };

  const handleReorder = () => {
    // Add items back to cart
    alert('Items have been added to the cart!');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div style={orderDetailStyles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Loading order information...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={orderDetailStyles.container}>
        <div style={orderDetailStyles.notFound}>
          <div style={orderDetailStyles.notFoundIcon}>📦</div>
          <div style={orderDetailStyles.notFoundText}>
            Order not found #{id}
          </div>
          <button
            style={orderDetailStyles.primaryBtn}
            onClick={() => navigate('/profile')}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={orderDetailStyles.container}>
      {/* Header */}
      <div style={orderDetailStyles.header}>
        <button
          style={orderDetailStyles.backBtn}
          onClick={() => navigate('/profile')}
        >
          ← Back
        </button>
        <div style={orderDetailStyles.orderIdBadge}>
          Order #{order.order_id}
        </div>
        <span style={getStatusStyle(order.status)}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Main Content */}
      <div style={orderDetailStyles.mainGrid}>
        {/* Left Column */}
        <div style={orderDetailStyles.leftColumn}>
          {/* Timeline */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              📍 Order Status
            </h3>
            <OrderDetailTimeline
              status={order.status}
              styles={orderDetailStyles}
              createdAt={order.created_at}
            />
          </div>

          {/* Products */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              Products Ordered
            </h3>
            <OrderDetailProducts
              items={order.items || []}
              styles={orderDetailStyles}
              formatPrice={formatPrice}
            />
          </div>

          {/* Shipping Info */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              Shipping Information
            </h3>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Recipient</span>
              <span style={orderDetailStyles.infoValue}>
                {order.customer_name || order.receiver_name || 'Customer'}
              </span>
            </div>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Phone Number</span>
              <span style={orderDetailStyles.infoValue}>
                {order.phone || order.receiver_phone || '0901234567'}
              </span>
            </div>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Address</span>
              <span style={orderDetailStyles.infoValue}>
                {order.shipping_address}
              </span>
            </div>
            <div style={{ ...orderDetailStyles.infoRow, ...orderDetailStyles.infoRowLast }}>
              <span style={orderDetailStyles.infoLabel}>Method</span>
              <span style={orderDetailStyles.infoValue}>
                {order.shipping_method?.name || order.shipping?.name || 'Standard Shipping'}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              Payment
            </h3>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Method</span>
              <span style={orderDetailStyles.infoValue}>
                {getPaymentMethodText(order.payment_method)}
              </span>
            </div>
            <div style={{ ...orderDetailStyles.infoRow, ...orderDetailStyles.infoRowLast }}>
              <span style={orderDetailStyles.infoLabel}>Status</span>
              <span style={{
                ...orderDetailStyles.infoValue,
                color: order.status === 'Delivered' ? '#28a745' : '#856404'
              }}>
                {order.status === 'Delivered' ? ' Paid' : 'Pending Payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={orderDetailStyles.rightColumn}>
          {/* Order Summary */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              Order Summary
            </h3>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Order ID</span>
              <span style={orderDetailStyles.infoValue}>#{order.order_id}</span>
            </div>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Order Date</span>
              <span style={orderDetailStyles.infoValue}>
                {formatDate(order.created_at)}
              </span>
            </div>
            {order.note && (
              <div style={{ ...orderDetailStyles.infoRow, ...orderDetailStyles.infoRowLast }}>
                <span style={orderDetailStyles.infoLabel}>Note</span>
                <span style={orderDetailStyles.infoValue}>{order.note}</span>
              </div>
            )}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
              <OrderDetailSummary
                order={order}
                styles={orderDetailStyles}
                formatPrice={formatPrice}
              />
            </div>

            {/* Action Buttons */}
            <div style={orderDetailStyles.actionButtons}>
              {order.status === 'Processing' && (
                <button
                  style={orderDetailStyles.dangerBtn}
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'Delivered' && (
                <>
                  <button
                    style={orderDetailStyles.primaryBtn}
                    onClick={() => navigate(`/review/${order.order_id}`)}
                  >
                    ⭐ Review
                  </button>
                  <button
                    style={orderDetailStyles.secondaryBtn}
                    onClick={handleReorder}
                  >
                    Reorder
                  </button>
                </>
              )}
              {order.status === 'Shipped' && (
                <button style={orderDetailStyles.primaryBtn}>
                  Contact Shipper
                </button>
              )}
            </div>
          </div>

          {/* Help Card */}
          <div style={orderDetailStyles.helpCard}>
            <div style={orderDetailStyles.helpTitle}>
              Need Help?
            </div>
            <div style={orderDetailStyles.helpText}>
              Contact us if you have any issues with your order
            </div>
            <button style={orderDetailStyles.helpBtn}>
              Chat with Support
            </button>
          </div>

          {/* Shop Contact */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              Contact Shop
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>{order.items?.[0]?.shop_name || order.items?.[0]?.shop?.shop_name || 'Shop'}</strong>
            </div>
            <button
              style={{ ...orderDetailStyles.secondaryBtn, width: '100%' }}
              onClick={() => alert('Open chat with shop')}
            >
              Chat with Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getPaymentMethodText = (method) => {
  const methods = {
    'COD': ' Cash on Delivery (COD)',
    'Banking': 'Bank Transfer',
    'Momo': 'MoMo Wallet',
    'ZaloPay': 'ZaloPay'
  };
  return methods[method] || method || 'COD';
};

export default OrderDetailPage;
