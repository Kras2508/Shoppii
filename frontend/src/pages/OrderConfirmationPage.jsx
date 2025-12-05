import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OrderSuccess, OrderTimeline, OrderInfo, OrderItems } from './order';
import orderStyles from './order/orderStyles';
import { orderService } from '../api/orderService';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Get order from location state hoặc fetch from API
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Nếu không có order từ state, fetch từ API
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const response = await orderService.getOrderById(orderId);
          if (response.data?.data) {
            setOrder(response.data.data);
          } else {
            setError('Không tìm thấy đơn hàng');
          }
        } catch (err) {
          console.error('Error fetching order:', err);
          setError('Can not load order details.');
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderId, isAuthenticated, navigate]);

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return ' VND';
    return Math.floor(price).toLocaleString('vi-VN') + ' VND';
  };

  if (loading) {
    return (
      <div style={orderStyles.page}>
        <div style={orderStyles.container}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Loading order information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={orderStyles.page}>
        <div style={orderStyles.container}>
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
            <h2 style={{ marginBottom: '12px' }}>Order Not Found</h2>
            <p style={{ color: '#758173', marginBottom: '24px' }}>
              Order not found. Please check your order history.
            </p>
            <Link to="/" style={orderStyles.primaryBtn}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={orderStyles.page}>
      <div style={orderStyles.container}>
        {/* Success Message */}
        <OrderSuccess 
          order={order} 
          styles={orderStyles} 
          formatPrice={formatPrice} 
        />

        {/* Order Timeline */}
        <OrderTimeline 
          order={order} 
          styles={orderStyles} 
        />

        {/* Order Info */}
        <OrderInfo 
          order={order} 
          styles={orderStyles} 
          formatPrice={formatPrice} 
        />

        {/* Order Items */}
        <OrderItems 
          order={order} 
          styles={orderStyles} 
          formatPrice={formatPrice} 
        />

        {/* Actions */}
        <div style={orderStyles.actionsSection}>
          <Link
            to={`/order/${order.order_id}`}
            style={orderStyles.secondaryBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#647A67';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#647A67';
            }}
          >
            Xem Đơn Hàng Của Tôi
          </Link>
          <Link
            to="/"
            style={orderStyles.primaryBtn}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#556B5A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#647A67'}
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
