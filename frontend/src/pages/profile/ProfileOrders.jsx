import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileOrders = ({ orders, filter, setFilter, styles, formatPrice }) => {
  const navigate = useNavigate();

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'Processing', label: 'Processing' },
    { key: 'Shipped', label: 'Shipped' },
    { key: 'Delivered', label: 'Delivered' },
    { key: 'Cancelled', label: 'Cancelled' }
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
      case 'Processing': return 'Processing';
      case 'Shipped': return 'Shipped';
      case 'Delivered': return 'Delivered';
      case 'Cancelled': return 'Cancelled';
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

  // Show empty state only if no orders at all
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

  // Show "no results" if filter returns no orders but orders exist
  if (filteredOrders.length === 0) {
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

        {/* Empty state for filter */}
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Không có đơn hàng nào với trạng thái này</p>
        </div>
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
        {filteredOrders.map(order => (
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
                      src={item.variant_image || item.product_image || item.image_url || '/placeholder.png'}
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
                    +{order.items.length - 2} more products
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
                      View Details
                    </button>
                    {order.status === 'Delivered' && (
                      <button 
                        style={{ ...styles.orderActionBtn, ...styles.reviewBtn }}
                        onClick={() => navigate(`/review/${order.order_id}`)}
                      >
                        Review
                      </button>
                    )}
                    {order.status === 'Delivered' && (
                      <button style={{ ...styles.orderActionBtn, ...styles.reorderBtn }}>
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
                <div style={styles.orderTotal}>
                  <span style={styles.orderTotalLabel}>Total:</span>
                  <span style={styles.orderTotalValue}>
                    {formatPrice(order.calculated_total || order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProfileOrders;
