import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import shopStyles from './shopStyles';

const ShopOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderDetail, setShowOrderDetail] = useState(null);

  // Mock orders data
  const orders = [
    {
      order_id: 1001,
      customer_name: 'Nguyễn Văn A',
      customer_phone: '0901234567',
      customer_address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      items: [
        { product_id: 1, name: 'Áo thun nam cotton cao cấp', variant: 'Trắng - L', quantity: 2, price: 129000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop' }
      ],
      total: 258000,
      shipping_fee: 30000,
      status: 'Processing',
      payment_method: 'COD',
      created_at: '2024-12-03 10:30',
      note: 'Giao giờ hành chính'
    },
    {
      order_id: 1002,
      customer_name: 'Trần Thị B',
      customer_phone: '0912345678',
      customer_address: '456 Đường Lê Lợi, Quận 3, TP.HCM',
      items: [
        { product_id: 2, name: 'Quần jean nam slim fit', variant: 'Xanh đậm - 32', quantity: 1, price: 259000, image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=80&h=80&fit=crop' },
        { product_id: 3, name: 'Giày thể thao sneaker', variant: 'Trắng - 42', quantity: 1, price: 450000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop' }
      ],
      total: 709000,
      shipping_fee: 0,
      status: 'Shipped',
      payment_method: 'Banking',
      created_at: '2024-12-02 15:45',
      note: ''
    },
    {
      order_id: 1003,
      customer_name: 'Lê Văn C',
      customer_phone: '0923456789',
      customer_address: '789 Đường Hai Bà Trưng, Quận 1, TP.HCM',
      items: [
        { product_id: 4, name: 'Váy midi hoa nhí', variant: 'Hồng - M', quantity: 1, price: 159000, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=80&h=80&fit=crop' }
      ],
      total: 159000,
      shipping_fee: 25000,
      status: 'Pending',
      payment_method: 'COD',
      created_at: '2024-12-03 08:15',
      note: 'Gọi trước khi giao'
    },
    {
      order_id: 1004,
      customer_name: 'Phạm Thị D',
      customer_phone: '0934567890',
      customer_address: '321 Đường Võ Văn Tần, Quận 3, TP.HCM',
      items: [
        { product_id: 1, name: 'Áo thun nam cotton cao cấp', variant: 'Đen - XL', quantity: 3, price: 129000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop' },
        { product_id: 5, name: 'Áo sơ mi công sở', variant: 'Xanh nhạt - L', quantity: 2, price: 199000, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop' }
      ],
      total: 785000,
      shipping_fee: 0,
      status: 'Delivered',
      payment_method: 'Banking',
      created_at: '2024-11-30 14:20',
      note: ''
    },
    {
      order_id: 1005,
      customer_name: 'Hoàng Văn E',
      customer_phone: '0945678901',
      customer_address: '654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
      items: [
        { product_id: 3, name: 'Giày thể thao sneaker', variant: 'Đen - 41', quantity: 1, price: 450000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop' }
      ],
      total: 450000,
      shipping_fee: 30000,
      status: 'Cancelled',
      payment_method: 'COD',
      created_at: '2024-11-29 09:00',
      note: 'Khách hủy - không liên lạc được'
    },
    {
      order_id: 1006,
      customer_name: 'Ngô Thị F',
      customer_phone: '0956789012',
      customer_address: '987 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
      items: [
        { product_id: 2, name: 'Quần jean nam slim fit', variant: 'Đen - 30', quantity: 2, price: 259000, image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=80&h=80&fit=crop' }
      ],
      total: 518000,
      shipping_fee: 0,
      status: 'Pending',
      payment_method: 'Banking',
      created_at: '2024-12-03 11:00',
      note: ''
    }
  ];

  // Stats
  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length
  };

  const styles = {
    ...shopStyles,
    tabs: {
      display: 'flex',
      gap: '0',
      borderBottom: '2px solid #eee',
      marginBottom: '20px',
      overflowX: 'auto'
    },
    tab: {
      padding: '14px 24px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#666',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      marginBottom: '-2px',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tabActive: {
      color: '#647A67',
      borderBottomColor: '#647A67'
    },
    tabBadge: {
      backgroundColor: '#eee',
      color: '#666',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '12px'
    },
    tabBadgeActive: {
      backgroundColor: '#C5EFCB',
      color: '#2e7d32'
    },
    searchBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px'
    },
    searchInput: {
      flex: 1,
      padding: '12px 16px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      outline: 'none'
    },
    orderCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      backgroundColor: '#f9f9f9',
      borderBottom: '1px solid #eee'
    },
    orderId: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1F241F'
    },
    orderDate: {
      fontSize: '13px',
      color: '#888'
    },
    orderBody: {
      padding: '16px 20px'
    },
    customerInfo: {
      display: 'flex',
      gap: '20px',
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    },
    customerDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#333'
    },
    itemRow: {
      display: 'flex',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0',
      alignItems: 'center'
    },
    itemImage: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      objectFit: 'cover'
    },
    itemInfo: {
      flex: 1
    },
    itemName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '4px'
    },
    itemVariant: {
      fontSize: '13px',
      color: '#888'
    },
    itemQty: {
      fontSize: '14px',
      color: '#666'
    },
    itemPrice: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#647A67'
    },
    orderFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderTop: '1px solid #eee',
      backgroundColor: '#fafafa'
    },
    orderTotal: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1F241F'
    },
    orderActions: {
      display: 'flex',
      gap: '10px'
    },
    actionBtn: {
      padding: '8px 16px',
      fontSize: '13px',
      borderRadius: '6px',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
      fontWeight: '500'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '500'
    },
    statusPending: {
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    statusProcessing: {
      backgroundColor: '#cce5ff',
      color: '#004085'
    },
    statusShipped: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusDelivered: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusCancelled: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    },
    modalHeader: {
      padding: '20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F241F'
    },
    modalClose: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#999'
    },
    modalBody: {
      padding: '20px'
    },
    timeline: {
      position: 'relative',
      paddingLeft: '30px'
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: '20px',
      borderLeft: '2px solid #eee',
      paddingLeft: '20px',
      marginLeft: '8px'
    },
    timelineDot: {
      position: 'absolute',
      left: '-9px',
      top: '0',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: '#647A67',
      border: '3px solid white',
      boxShadow: '0 0 0 2px #647A67'
    },
    timelineDotInactive: {
      backgroundColor: '#ddd',
      boxShadow: '0 0 0 2px #ddd'
    },
    note: {
      backgroundColor: '#fff3cd',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '13px',
      color: '#856404',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '12px'
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { ...styles.statusBadge, ...styles.statusPending };
      case 'Processing': return { ...styles.statusBadge, ...styles.statusProcessing };
      case 'Shipped': return { ...styles.statusBadge, ...styles.statusShipped };
      case 'Delivered': return { ...styles.statusBadge, ...styles.statusDelivered };
      case 'Cancelled': return { ...styles.statusBadge, ...styles.statusCancelled };
      default: return styles.statusBadge;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return '⏳ Chờ xác nhận';
      case 'Processing': return '📦 Đang xử lý';
      case 'Shipped': return '🚚 Đang giao';
      case 'Delivered': return '✅ Đã giao';
      case 'Cancelled': return '❌ Đã hủy';
      default: return status;
    }
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status.toLowerCase() !== filterStatus) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (!order.order_id.toString().includes(search) &&
          !order.customer_name.toLowerCase().includes(search) &&
          !order.customer_phone.includes(search)) return false;
    }
    return true;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    // In real app, call API
    alert(`Đơn hàng #${orderId} đã được cập nhật thành ${newStatus}`);
  };

  const tabs = [
    { key: 'all', label: 'Tất cả', count: stats.all },
    { key: 'pending', label: 'Chờ xác nhận', count: stats.pending },
    { key: 'processing', label: 'Đang xử lý', count: stats.processing },
    { key: 'shipped', label: 'Đang giao', count: stats.shipped },
    { key: 'delivered', label: 'Đã giao', count: stats.delivered },
    { key: 'cancelled', label: 'Đã hủy', count: stats.cancelled }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>📋 Quản lý đơn hàng</h1>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              style={{
                ...styles.tab,
                ...(filterStatus === tab.key ? styles.tabActive : {})
              }}
              onClick={() => setFilterStatus(tab.key)}
            >
              {tab.label}
              <span style={{
                ...styles.tabBadge,
                ...(filterStatus === tab.key ? styles.tabBadgeActive : {})
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Tìm theo mã đơn, tên khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '16px', color: '#666' }}>Không có đơn hàng nào</div>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.order_id} style={styles.orderCard}>
              {/* Header */}
              <div style={styles.orderHeader}>
                <div>
                  <span style={styles.orderId}>Đơn hàng #{order.order_id}</span>
                  <span style={{ marginLeft: '12px', ...styles.orderDate }}>{order.created_at}</span>
                </div>
                <span style={getStatusStyle(order.status)}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Body */}
              <div style={styles.orderBody}>
                {/* Customer Info */}
                <div style={styles.customerInfo}>
                  <div style={styles.customerDetail}>
                    <span>👤</span> {order.customer_name}
                  </div>
                  <div style={styles.customerDetail}>
                    <span>📞</span> {order.customer_phone}
                  </div>
                  <div style={styles.customerDetail}>
                    <span>💳</span> {order.payment_method}
                  </div>
                </div>

                {/* Items */}
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <img src={item.image} alt="" style={styles.itemImage} />
                    <div style={styles.itemInfo}>
                      <div style={styles.itemName}>{item.name}</div>
                      <div style={styles.itemVariant}>{item.variant}</div>
                    </div>
                    <div style={styles.itemQty}>x{item.quantity}</div>
                    <div style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}

                {/* Note */}
                {order.note && (
                  <div style={styles.note}>
                    <span>📝</span> {order.note}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={styles.orderFooter}>
                <div>
                  <span style={{ color: '#888', fontSize: '14px' }}>Tổng tiền: </span>
                  <span style={styles.orderTotal}>{formatPrice(order.total + order.shipping_fee)}</span>
                  {order.shipping_fee > 0 && (
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
                      (Ship: {formatPrice(order.shipping_fee)})
                    </span>
                  )}
                </div>
                <div style={styles.orderActions}>
                  <button
                    style={{ ...styles.actionBtn, backgroundColor: '#f0f0f0', color: '#333' }}
                    onClick={() => setShowOrderDetail(order)}
                  >
                    👁️ Chi tiết
                  </button>
                  
                  {order.status === 'Pending' && (
                    <>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: '#647A67', color: 'white' }}
                        onClick={() => handleUpdateStatus(order.order_id, 'Processing')}
                      >
                        ✓ Xác nhận
                      </button>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: '#dc3545', color: 'white' }}
                        onClick={() => handleUpdateStatus(order.order_id, 'Cancelled')}
                      >
                        ✕ Hủy
                      </button>
                    </>
                  )}
                  
                  {order.status === 'Processing' && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: '#647A67', color: 'white' }}
                      onClick={() => handleUpdateStatus(order.order_id, 'Shipped')}
                    >
                      🚚 Giao hàng
                    </button>
                  )}
                  
                  {order.status === 'Shipped' && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: '#28a745', color: 'white' }}
                      onClick={() => handleUpdateStatus(order.order_id, 'Delivered')}
                    >
                      ✅ Đã giao
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Order Detail Modal */}
        {showOrderDetail && (
          <div style={styles.modal} onClick={() => setShowOrderDetail(null)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <span style={styles.modalTitle}>
                  Chi tiết đơn hàng #{showOrderDetail.order_id}
                </span>
                <button style={styles.modalClose} onClick={() => setShowOrderDetail(null)}>×</button>
              </div>
              <div style={styles.modalBody}>
                {/* Status */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <span style={{ ...getStatusStyle(showOrderDetail.status), padding: '8px 20px', fontSize: '14px' }}>
                    {getStatusText(showOrderDetail.status)}
                  </span>
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>📍 Trạng thái đơn hàng</h4>
                  <div style={styles.timeline}>
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, idx) => {
                      const isActive = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(showOrderDetail.status) >= idx;
                      const isCancelled = showOrderDetail.status === 'Cancelled';
                      return (
                        <div key={status} style={styles.timelineItem}>
                          <div style={{
                            ...styles.timelineDot,
                            ...(isActive && !isCancelled ? {} : styles.timelineDotInactive)
                          }} />
                          <div style={{ fontSize: '14px', color: isActive && !isCancelled ? '#1F241F' : '#999' }}>
                            {getStatusText(status)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>👤 Thông tin khách hàng</h4>
                  <div style={{ backgroundColor: '#f9f9f9', padding: '14px', borderRadius: '8px', fontSize: '14px' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Tên:</strong> {showOrderDetail.customer_name}</div>
                    <div style={{ marginBottom: '8px' }}><strong>SĐT:</strong> {showOrderDetail.customer_phone}</div>
                    <div><strong>Địa chỉ:</strong> {showOrderDetail.customer_address}</div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>📦 Sản phẩm</h4>
                  {showOrderDetail.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '8px' }}>
                      <img src={item.image} alt="" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{item.variant}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px' }}>x{item.quantity}</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#647A67' }}>{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div style={{ backgroundColor: '#f0f7f1', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Tạm tính:</span>
                    <span>{formatPrice(showOrderDetail.total)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Phí vận chuyển:</span>
                    <span>{showOrderDetail.shipping_fee > 0 ? formatPrice(showOrderDetail.shipping_fee) : 'Miễn phí'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600', paddingTop: '8px', borderTop: '1px solid #cde5d0' }}>
                    <span>Tổng cộng:</span>
                    <span style={{ color: '#647A67' }}>{formatPrice(showOrderDetail.total + showOrderDetail.shipping_fee)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrdersPage;
