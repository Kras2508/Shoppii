import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileOrders = ({ orders, filter, setFilter, styles, formatPrice }) => {
  const navigate = useNavigate();

  const filters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Processing', label: 'Đang xử lý' },
    { key: 'Shipped', label: 'Đang giao' },
    { key: 'Delivered', label: 'Đã giao' },
    { key: 'Cancelled', label: 'Đã hủy' }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Processing':
        return { ...styles.orderStatus, ...styles.statusProcessing };
      case 'Shipped':
        return { ...styles.orderStatus, ...styles.statusShipped };
      case 'Delivered':
        return { ...styles.orderStatus, ...styles.statusDelivered };
      case 'Cancelled':
        return { ...styles.orderStatus, ...styles.statusCancelled };
      default:
        return styles.orderStatus;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Processing': return 'Đang xử lý';
      case 'Shipped': return 'Đang giao';
      case 'Delivered': return 'Đã giao';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const handleViewOrder = (order) => {
    navigate(`/order/${order.order_id}`, { state: { order } });
  };

  if (orders.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📦</div>
        <p style={styles.emptyText}>Bạn chưa có đơn hàng nào</p>
        <Link to="/products">
          <button style={styles.emptyAction}>Mua sắm ngay</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div style={styles.orderFilters}>
        {filters.map(f => (
          <button
            key={f.key}
            style={{
              ...styles.filterBtn,
              ...(filter === f.key ? styles.filterBtnActive : {})
            }}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={styles.ordersList}>
        {filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Không có đơn hàng nào</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.order_id} style={styles.orderCard}>
              {/* Order Header */}
              <div style={styles.orderHeader}>
                <div style={styles.orderShop}>
                  <span>🏪</span>
                  {order.shops?.join(', ') || 'Shop'}
                </div>
                <span style={getStatusStyle(order.status)}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Order Items */}
              <div style={styles.orderItems}>
                {order.items.slice(0, 2).map((item, idx) => (
                  <div 
                    key={item.order_item_id} 
                    style={{
                      ...styles.orderItem,
                      ...(idx === Math.min(order.items.length - 1, 1) ? styles.orderItemLast : {})
                    }}
                  >
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      style={styles.orderItemImage}
                    />
                    <div style={styles.orderItemInfo}>
                      <div style={styles.orderItemName}>{item.product_name}</div>
                      <div style={styles.orderItemVariant}>
                        {item.color}{item.type ? `, ${item.type}` : ''} | x{item.quantity}
                      </div>
                      <div style={styles.orderItemPrice}>
                        {formatPrice(item.price_at_purchase || item.price)}
                      </div>
                    </div>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
                    +{order.items.length - 2} sản phẩm khác
                  </div>
                )}
              </div>

              {/* Order Footer */}
              <div style={styles.orderFooter}>
                <div>
                  <div style={styles.orderDate}>
                    🕐 {formatDate(order.created_at)}
                  </div>
                  <div style={styles.orderActions}>
                    <button 
                      style={{ ...styles.orderActionBtn, ...styles.viewOrderBtn }}
                      onClick={() => handleViewOrder(order)}
                    >
                      Xem chi tiết
                    </button>
                    {order.status === 'Delivered' && (
                      <button 
                        style={{ ...styles.orderActionBtn, ...styles.reviewBtn }}
                        onClick={() => navigate(`/review/${order.order_id}`)}
                      >
                        Đánh giá
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <button style={{ ...styles.orderActionBtn, ...styles.reorderBtn }}>
                        Mua lại
                      </button>
                    )}
                  </div>
                </div>
                <div style={styles.orderTotal}>
                  <span style={styles.orderTotalLabel}>Tổng tiền:</span>
                  <span style={styles.orderTotalValue}>
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileOrders;
