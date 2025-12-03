import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OrderSuccess, OrderTimeline, OrderInfo, OrderItems } from './order';
import orderStyles from './order/orderStyles';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Get order from location state hoặc mock data
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Nếu không có order từ state, fetch mock data
    if (!order && orderId) {
      // Mock order data theo database schema
      const mockOrder = {
        order_id: parseInt(orderId) || 1001,
        customer_id: 1,
        shipping_id: 1,
        voucher_id: null,
        status: 'Processing', // Processing, Shipped, Delivered, Cancelled
        order_date: new Date().toISOString(),
        shipping_address: '123 Nguyễn Văn A, Phường 1, Quận 1, TP. Hồ Chí Minh',
        total_amount: 737000,
        payment_method: 'COD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        
        // Related data
        shipping: {
          shipping_id: 1,
          name: 'Giao hàng tiêu chuẩn',
          estimated_days: 5,
          fee: 30000,
          status: 'Active'
        },
        voucher: null,
        
        // Calculated fields
        subtotal: 707000,
        shipping_fee: 30000,
        discount: 0,
        
        // Order items - theo OrderItem table
        items: [
          {
            order_item_id: 1,
            order_id: 1001,
            variantID: 1,
            shop_id: 1,
            quantity: 2,
            price_at_purchase: 129000,
            // Extended data
            product_id: 1,
            product_name: 'Áo thun nam cotton cao cấp Premium',
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
            color: 'Trắng',
            type: 'L',
            shop_name: 'Cửa hàng Kim Tín'
          },
          {
            order_item_id: 2,
            order_id: 1001,
            variantID: 3,
            shop_id: 1,
            quantity: 1,
            price_at_purchase: 449000,
            // Extended data
            product_id: 3,
            product_name: 'Giày thể thao nam sneaker',
            image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
            color: 'Đỏ',
            type: '42',
            shop_name: 'Cửa hàng Kim Tín'
          }
        ]
      };
      
      setOrder(mockOrder);
      setLoading(false);
    }
  }, [order, orderId, isAuthenticated, navigate]);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  if (loading) {
    return (
      <div style={orderStyles.page}>
        <div style={orderStyles.container}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
            <p>Đang tải thông tin đơn hàng...</p>
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
            <h2 style={{ marginBottom: '12px' }}>Không tìm thấy đơn hàng</h2>
            <p style={{ color: '#758173', marginBottom: '24px' }}>
              Đơn hàng không tồn tại hoặc bạn không có quyền xem.
            </p>
            <Link to="/" style={orderStyles.primaryBtn}>
              Về Trang Chủ
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
