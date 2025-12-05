import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shopStyles from './shopStyles';
import { orderService } from '../../api/orderService';
import createPrivateClient from '../../clients/private.client';

const ShopOrdersPage = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);
  
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderDetail, setShowOrderDetail] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filterStatus !== 'all') {
          params.status = filterStatus;
        }
        const response = await orderService.getOrders(privateClient, params);
        if (response.data?.data?.orders) {
          setOrders(response.data.data.orders.map(order => ({
            order_id: order.order_id,
            customer_name: order.customer_name || 'Khách hàng',
            customer_phone: order.customer_phone || '',
            customer_address: order.shipping_address,
            items: (order.items || []).map(item => ({
              name: item.product_name || '',
              image: item.variant_image || item.product_image || '',
              variant: item.color && item.type ? `${item.color} - ${item.type}` : '',
              quantity: item.quantity || 1,
              price: parseFloat(item.price_at_purchase) || 0
            })),
            total: parseFloat(order.total_amount) || 0,
            shipping_fee: parseFloat(order.shipping_fee) || 0,
            status: order.status,
            payment_method: order.payment_method,
            created_at: new Date(order.created_at).toLocaleString('vi-VN'),
            note: order.note || ''
          })));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Cannot load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filterStatus, token]);

  // Stats
  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
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
      marginBottom: '-2px',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
      borderWidth: '0 0 2px 0',
      borderStyle: 'solid',
      borderColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tabActive: {
      color: '#647A67',
      borderColor: 'transparent transparent #647A67 transparent'
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
      case 'Pending': return '⏳ Pending';
      case 'Processing': return '📦 Processing';
      case 'Shipped': return '🚚 Shipped';
      case 'Delivered': return '✅ Delivered';
      case 'Cancelled': return '❌ Cancelled';
      default: return status;
    }
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' VND';

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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await privateClient.put(`/orders/${orderId}/status`, {
        status: newStatus
      });
      if (response.data?.success) {
        // Update local state
        setOrders(orders.map(o => 
          o.order_id === orderId 
            ? { ...o, status: newStatus }
            : o
        ));
        console.log(`Order #${orderId} updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const tabs = [
    { key: 'all', label: 'All', count: stats.all },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'processing', label: 'Processing', count: stats.processing },
    { key: 'shipped', label: 'Shipped', count: stats.shipped },
    { key: 'delivered', label: 'Delivered', count: stats.delivered },
    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Order Management</h1>
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
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Searching based on order id, customer name, phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{ ...styles.card, textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '16px', color: '#666' }}>No orders found</div>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.order_id} style={styles.orderCard}>
              {/* Header */}
              <div style={styles.orderHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order.order_id}</span>
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
                  <span style={{ color: '#888', fontSize: '14px' }}>Total: </span>
                  <span style={styles.orderTotal}>{formatPrice(order.total)}</span>
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
                    Details
                  </button>
                  
                  {order.status === 'Pending' && (
                    <>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: '#647A67', color: 'white' }}
                        onClick={() => handleUpdateStatus(order.order_id, 'Processing')}
                      >
                        Confirm
                      </button>
                      <button
                        style={{ ...styles.actionBtn, backgroundColor: '#dc3545', color: 'white' }}
                        onClick={() => handleUpdateStatus(order.order_id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {order.status === 'Processing' && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: '#647A67', color: 'white' }}
                      onClick={() => handleUpdateStatus(order.order_id, 'Shipped')}
                    >
                      Ship
                    </button>
                  )}
                  
                  {order.status === 'Shipped' && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: '#28a745', color: 'white' }}
                      onClick={() => handleUpdateStatus(order.order_id, 'Delivered')}
                    >
                      Delivered
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
                  Order Details #{showOrderDetail.order_id}
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
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>📍 Order Status</h4>
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
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Customer Information</h4>
                  <div style={{ backgroundColor: '#f9f9f9', padding: '14px', borderRadius: '8px', fontSize: '14px' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Name:</strong> {showOrderDetail.customer_name}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Phone:</strong> {showOrderDetail.customer_phone}</div>
                    <div><strong>Address:</strong> {showOrderDetail.customer_address}</div>
                  </div>
                </div>

                {/* Items */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Products</h4>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600', paddingTop: '8px', borderTop: '1px solid #cde5d0' }}>
                    <span>Total:</span>
                    <span style={{ color: '#647A67' }}>{formatPrice(showOrderDetail.total)}</span>
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
