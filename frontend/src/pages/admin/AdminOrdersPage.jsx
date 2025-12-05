import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminStyles from './adminStyles.js';
import { adminService } from '../../api/adminService.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import createPrivateClient from '../../clients/private.client';

const AdminOrdersPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllOrders(privateClient, {
          search: searchTerm || undefined
        });
        if (response.data?.data?.orders) {
          setOrders(response.data.data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, searchTerm]);

  const filteredOrders = orders.filter(order => {
    const matchSearch = 
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shop_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const styles = {
    ...adminStyles,
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    filterRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      alignItems: 'flex-end'
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minWidth: '180px',
      outline: 'none',
      cursor: 'pointer'
    }
  };

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger',
      'Refunded': 'secondary'
    };
    return statusMap[status] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'Pending': '⏳',
      'Confirmed': '✓',
      'Shipped': '🚚',
      'Delivered': '📦',
      'Cancelled': '✕',
      'Refunded': '↩️'
    };
    return iconMap[status] || '?';
  };

  const statusCounts = {
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled' || o.status === 'Refunded').length
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await privateClient.put(`/orders/${selectedOrder.order_id}/status`, {
        status: newStatus
      });
      if (response.data?.success) {
        // Update local state
        setOrders(orders.map(o => 
          o.order_id === selectedOrder.order_id 
            ? { ...o, status: newStatus }
            : o
        ));
        setSelectedOrder({ ...selectedOrder, status: newStatus });
        console.log('Order status updated:', newStatus);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={adminStyles.pageTitle}>Quản lý Đơn hàng</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Tổng: <strong>{orders.length}</strong> đơn hàng
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #f39c12' }}>
          <div>
            <div style={adminStyles.statLabel}>Chờ xử lý</div>
            <div style={adminStyles.statValue}>{statusCounts.pending}</div>
          </div>
          <span style={{ fontSize: '28px' }}>⏳</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #3498db' }}>
          <div>
            <div style={adminStyles.statLabel}>Đã xác nhận</div>
            <div style={adminStyles.statValue}>{statusCounts.confirmed}</div>
          </div>
          <span style={{ fontSize: '28px' }}>✓</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #9b59b6' }}>
          <div>
            <div style={adminStyles.statLabel}>Đang giao</div>
            <div style={adminStyles.statValue}>{statusCounts.shipped}</div>
          </div>
          <span style={{ fontSize: '28px' }}>🚚</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #2ecc71' }}>
          <div>
            <div style={adminStyles.statLabel}>Đã giao</div>
            <div style={adminStyles.statValue}>{statusCounts.delivered}</div>
          </div>
          <span style={{ fontSize: '28px' }}>📦</span>
        </div>
        <div style={{ ...adminStyles.statCard, borderLeft: '4px solid #e74c3c' }}>
          <div>
            <div style={adminStyles.statLabel}>Đã hủy/Hoàn</div>
            <div style={adminStyles.statValue}>{statusCounts.cancelled}</div>
          </div>
          <span style={{ fontSize: '28px' }}>✕</span>
        </div>
      </div>

      {/* Main Card */}
      <div style={adminStyles.card}>
        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="🔍 Tìm kiếm theo mã đơn, tên khách hàng, shop..."
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
            <option value="Pending">Chờ xử lý</option>
            <option value="Confirmed">Đã xác nhận</option>
            <option value="Shipped">Đang giao</option>
            <option value="Delivered">Đã giao</option>
            <option value="Cancelled">Đã hủy</option>
            <option value="Refunded">Đã hoàn tiền</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={adminStyles.table}>
            <thead>
              <tr>
                <th style={adminStyles.th}>Mã đơn</th>
                <th style={adminStyles.th}>Khách hàng</th>
                <th style={adminStyles.th}>Shop</th>
                <th style={adminStyles.th}>Tổng tiền</th>
                <th style={adminStyles.th}>Trạng thái</th>
                <th style={adminStyles.th}>Thời gian</th>
                <th style={adminStyles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                return (
                  <tr key={order.id}>
                    <td style={adminStyles.td}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#3498db' }}>
                        #{order.order_id}
                      </span>
                    </td>
                    <td style={adminStyles.td}>
                      <div style={{ fontWeight: '500' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{order.customer_email}</div>
                    </td>
                    <td style={adminStyles.td}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🏪 {order.shop_name}
                      </span>
                    </td>
                    <td style={adminStyles.td}>
                      <span style={{ fontWeight: '600', color: '#e74c3c' }}>
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td style={adminStyles.td}>
                      <Badge variant={getStatusBadgeVariant(order.status)} size="small">
                        {getStatusIcon(order.status)} {order.status}
                      </Badge>
                    </td>
                    <td style={adminStyles.td}>
                      <span style={{ fontSize: '13px', color: '#666' }}>{order.created_at}</span>
                    </td>
                    <td style={adminStyles.td}>
                      <Button
                        variant="primary"
                        size="small"
                        icon="👁️"
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Không tìm thấy đơn hàng nào
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={`Chi tiết Đơn hàng #${selectedOrder.order_id}`}
          size="large"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedOrder.status !== 'Pending' && (
                  <Button variant="outline" size="small" onClick={() => handleUpdateStatus('Pending')}>
                    → Chờ xử lý
                  </Button>
                )}
                {selectedOrder.status !== 'Confirmed' && (
                  <Button variant="outline" size="small" onClick={() => handleUpdateStatus('Confirmed')}>
                    ✓ Xác nhận
                  </Button>
                )}
                {selectedOrder.status !== 'Shipped' && (
                  <Button variant="outline" size="small" onClick={() => handleUpdateStatus('Shipped')}>
                    🚚 Đang giao
                  </Button>
                )}
                {selectedOrder.status !== 'Delivered' && (
                  <Button variant="outline" size="small" onClick={() => handleUpdateStatus('Delivered')}>
                    📦 Đã giao
                  </Button>
                )}
                {selectedOrder.status !== 'Cancelled' && (
                  <Button variant="danger" size="small" onClick={() => handleUpdateStatus('Cancelled')}>
                    ✕ Hủy
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
            </div>
          }
        >
          <>
            {/* Status */}
            <div style={{ marginBottom: '20px' }}>
              <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
              </Badge>
            </div>

            {/* Customer & Shop Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Khách hàng</div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{selectedOrder.customer_name}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>{selectedOrder.customer_email}</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Shop</div>
                <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🏪 {selectedOrder.shop_name}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Địa chỉ giao hàng</div>
              <div style={{ fontWeight: '500' }}>📍 {selectedOrder.shipping_address}</div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Sản phẩm</div>
              {selectedOrder.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>x{item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#e74c3c' }}>{formatCurrency(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            {/* Payment & Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#1a1a2e', borderRadius: '8px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Phương thức thanh toán</div>
                <div style={{ color: 'white', fontWeight: '500' }}>{selectedOrder.payment_method}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Tổng tiền</div>
                <div style={{ color: '#e74c3c', fontWeight: '700', fontSize: '20px' }}>{formatCurrency(selectedOrder.total)}</div>
              </div>
            </div>

            {/* Cancel/Refund Reason */}
            {selectedOrder.cancel_reason && (
              <div style={{ padding: '16px', backgroundColor: '#f8d7da', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#721c24', marginBottom: '4px' }}>Lý do hủy</div>
                <div style={{ color: '#721c24', fontWeight: '500' }}>{selectedOrder.cancel_reason}</div>
              </div>
            )}
            {selectedOrder.refund_reason && (
              <div style={{ padding: '16px', backgroundColor: '#e2e3e5', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#41464b', marginBottom: '4px' }}>Lý do hoàn tiền</div>
                <div style={{ color: '#41464b', fontWeight: '500' }}>{selectedOrder.refund_reason}</div>
              </div>
            )}

          {/* Time */}
          <div style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>
            Đặt hàng lúc: {selectedOrder.created_at}
          </div>
        </>
      </Modal>
      )}
    </div>
  );
};

export default AdminOrdersPage;
