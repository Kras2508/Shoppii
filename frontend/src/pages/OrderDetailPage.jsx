import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OrderDetailTimeline from './order/OrderDetailTimeline';
import OrderDetailProducts from './order/OrderDetailProducts';
import OrderDetailSummary from './order/OrderDetailSummary';
import orderDetailStyles from './order/orderDetailStyles';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Get order from navigation state or fetch
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!order) {
      // Mock fetch order by ID
      setTimeout(() => {
        const mockOrder = getMockOrderById(id);
        setOrder(mockOrder);
        setLoading(false);
      }, 500);
    }
  }, [id, order, isAuthenticated, navigate]);

  const formatPrice = (price) => {
    const value = Number(price ?? 0);
    return value.toLocaleString('vi-VN') + 'đ';
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
      case 'Processing': return 'Đang xử lý';
      case 'Shipped': return 'Đang giao hàng';
      case 'Delivered': return 'Đã giao hàng';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = () => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      alert('Đã gửi yêu cầu hủy đơn hàng!');
      setOrder(prev => ({ ...prev, status: 'Cancelled' }));
    }
  };

  const handleReorder = () => {
    // Add items back to cart
    alert('Đã thêm các sản phẩm vào giỏ hàng!');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div style={orderDetailStyles.container}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <p>Đang tải thông tin đơn hàng...</p>
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
            Không tìm thấy đơn hàng #{id}
          </div>
          <button
            style={orderDetailStyles.primaryBtn}
            onClick={() => navigate('/profile')}
          >
            Quay lại đơn hàng
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
          ← Quay lại
        </button>
        <div style={orderDetailStyles.orderIdBadge}>
          Đơn hàng #{order.order_id}
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
              📍 Trạng thái đơn hàng
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
              🛍️ Sản phẩm đã đặt
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
              🚚 Thông tin giao hàng
            </h3>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Người nhận</span>
              <span style={orderDetailStyles.infoValue}>
                {order.customer_name || order.receiver_name || 'Khách hàng'}
              </span>
            </div>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Số điện thoại</span>
              <span style={orderDetailStyles.infoValue}>
                {order.phone || order.receiver_phone || '0901234567'}
              </span>
            </div>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Địa chỉ</span>
              <span style={orderDetailStyles.infoValue}>
                {order.shipping_address}
              </span>
            </div>
            <div style={{ ...orderDetailStyles.infoRow, ...orderDetailStyles.infoRowLast }}>
              <span style={orderDetailStyles.infoLabel}>Phương thức</span>
              <span style={orderDetailStyles.infoValue}>
                {order.shipping_method?.name || order.shipping?.name || 'Giao hàng tiêu chuẩn'}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              💳 Thanh toán
            </h3>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Phương thức</span>
              <span style={orderDetailStyles.infoValue}>
                {getPaymentMethodText(order.payment_method)}
              </span>
            </div>
            <div style={{ ...orderDetailStyles.infoRow, ...orderDetailStyles.infoRowLast }}>
              <span style={orderDetailStyles.infoLabel}>Trạng thái</span>
              <span style={{
                ...orderDetailStyles.infoValue,
                color: order.status === 'Delivered' ? '#28a745' : '#856404'
              }}>
                {order.status === 'Delivered' ? '✅ Đã thanh toán' : '⏳ Chờ thanh toán'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={orderDetailStyles.rightColumn}>
          {/* Order Summary */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              📋 Tóm tắt đơn hàng
            </h3>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Mã đơn hàng</span>
              <span style={orderDetailStyles.infoValue}>#{order.order_id}</span>
            </div>
            <div style={orderDetailStyles.infoRow}>
              <span style={orderDetailStyles.infoLabel}>Ngày đặt</span>
              <span style={orderDetailStyles.infoValue}>
                {formatDate(order.created_at)}
              </span>
            </div>
            {order.note && (
              <div style={{ ...orderDetailStyles.infoRow, ...orderDetailStyles.infoRowLast }}>
                <span style={orderDetailStyles.infoLabel}>Ghi chú</span>
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
                  Hủy đơn
                </button>
              )}
              {order.status === 'Delivered' && (
                <>
                  <button
                    style={orderDetailStyles.primaryBtn}
                    onClick={() => navigate(`/review/${order.order_id}`)}
                  >
                    ⭐ Đánh giá
                  </button>
                  <button
                    style={orderDetailStyles.secondaryBtn}
                    onClick={handleReorder}
                  >
                    🔄 Mua lại
                  </button>
                </>
              )}
              {order.status === 'Shipped' && (
                <button style={orderDetailStyles.primaryBtn}>
                  📞 Liên hệ shipper
                </button>
              )}
            </div>
          </div>

          {/* Help Card */}
          <div style={orderDetailStyles.helpCard}>
            <div style={orderDetailStyles.helpTitle}>
              Cần hỗ trợ?
            </div>
            <div style={orderDetailStyles.helpText}>
              Liên hệ với chúng tôi nếu bạn gặp vấn đề với đơn hàng
            </div>
            <button style={orderDetailStyles.helpBtn}>
              💬 Chat với hỗ trợ
            </button>
          </div>

          {/* Shop Contact */}
          <div style={orderDetailStyles.card}>
            <h3 style={orderDetailStyles.cardTitle}>
              🏪 Liên hệ shop
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <strong>{order.items?.[0]?.shop_name || order.items?.[0]?.shop?.shop_name || 'Shop'}</strong>
            </div>
            <button
              style={{ ...orderDetailStyles.secondaryBtn, width: '100%' }}
              onClick={() => alert('Mở chat với shop')}
            >
              💬 Chat với shop
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
    'COD': '💵 Thanh toán khi nhận hàng (COD)',
    'Banking': '🏦 Chuyển khoản ngân hàng',
    'Momo': '📱 Ví MoMo',
    'ZaloPay': '💳 ZaloPay'
  };
  return methods[method] || method || 'COD';
};

// Mock data
const getMockOrderById = (id) => {
  const mockOrders = {
    '1001': {
      order_id: 1001,
      customer_id: 1,
      customer_name: 'Nguyễn Văn A',
      phone: '0901234567',
      shipping_id: 2,
      voucher_id: 1,
      status: 'Delivered',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      shipping_method: { name: 'Giao hàng nhanh', fee: 50000 },
      subtotal: 707000,
      shipping_fee: 50000,
      discount: 70700,
      total_price: 686300,
      payment_method: 'COD',
      voucher: { code: 'GIAM10', discount_amount: 70700 },
      created_at: '2024-11-28T14:30:00',
      items: [
        {
          order_item_id: 1,
          product_id: 1,
          product_name: 'Áo thun nam cotton cao cấp Premium',
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
          color: 'Trắng',
          type: 'L',
          quantity: 2,
          price: 129000,
          price_at_purchase: 129000,
          shop_id: 1,
          shop_name: 'Cửa hàng Kim Tín'
        },
        {
          order_item_id: 2,
          product_id: 3,
          product_name: 'Giày thể thao nam sneaker',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
          color: 'Đỏ',
          type: '42',
          quantity: 1,
          price: 449000,
          price_at_purchase: 449000,
          shop_id: 1,
          shop_name: 'Cửa hàng Kim Tín'
        }
      ]
    },
    '1002': {
      order_id: 1002,
      customer_id: 1,
      customer_name: 'Nguyễn Văn A',
      phone: '0901234567',
      status: 'Shipped',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      shipping_method: { name: 'Giao hàng tiêu chuẩn', fee: 30000 },
      subtotal: 1580000,
      shipping_fee: 30000,
      discount: 0,
      total_price: 1610000,
      payment_method: 'Banking',
      created_at: '2024-12-01T09:15:00',
      items: [
        {
          order_item_id: 3,
          product_id: 5,
          product_name: 'Tai nghe Bluetooth không dây TWS',
          image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
          color: 'Đen',
          type: 'Pro',
          quantity: 1,
          price: 890000,
          price_at_purchase: 890000,
          shop_id: 2,
          shop_name: 'TechZone Official'
        },
        {
          order_item_id: 4,
          product_id: 6,
          product_name: 'Ốp lưng iPhone 15 Pro Max',
          image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=200&fit=crop',
          color: 'Trong suốt',
          type: 'MagSafe',
          quantity: 2,
          price: 345000,
          price_at_purchase: 345000,
          shop_id: 2,
          shop_name: 'TechZone Official'
        }
      ]
    },
    '1003': {
      order_id: 1003,
      customer_id: 1,
      customer_name: 'Nguyễn Văn A',
      phone: '0901234567',
      status: 'Processing',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      shipping_method: { name: 'Giao hỏa tốc', fee: 80000 },
      subtotal: 2150000,
      shipping_fee: 80000,
      discount: 215000,
      total_price: 2015000,
      payment_method: 'Momo',
      voucher: { code: 'GIAM10', discount_amount: 215000 },
      created_at: '2024-12-02T16:45:00',
      items: [
        {
          order_item_id: 5,
          product_id: 7,
          product_name: 'Váy đầm nữ phong cách Hàn Quốc',
          image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop',
          color: 'Hồng',
          type: 'M',
          quantity: 1,
          price: 650000,
          price_at_purchase: 585000,
          shop_id: 3,
          shop_name: 'Fashion House'
        },
        {
          order_item_id: 6,
          product_id: 8,
          product_name: 'Son môi lì cao cấp',
          image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop',
          color: 'Đỏ cherry',
          type: 'Matte',
          quantity: 3,
          price: 350000,
          price_at_purchase: 315000,
          shop_id: 4,
          shop_name: 'Beauty Store'
        }
      ]
    }
  };

  return mockOrders[id] || null;
};

export default OrderDetailPage;
