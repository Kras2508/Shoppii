import React, { useState } from 'react';
import adminStyles from './adminStyles.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data
  const orders = [
    {
      id: 1, order_id: 'ORD001', customer_name: 'Nguyễn Văn A', customer_email: 'nguyenvana@gmail.com',
      shop_name: 'Fashion House', total: 1590000, status: 'Delivered', created_at: '2024-04-20 14:30',
      items: [
        { name: 'Áo thun nam basic', quantity: 2, price: 299000 },
        { name: 'Quần jean slim fit', quantity: 1, price: 599000 }
      ],
      shipping_address: '123 Nguyễn Huệ, Q.1, TP.HCM', payment_method: 'COD'
    },
    {
      id: 2, order_id: 'ORD002', customer_name: 'Trần Thị B', customer_email: 'tranthib@gmail.com',
      shop_name: 'Tech World', total: 34990000, status: 'Shipped', created_at: '2024-04-21 09:15',
      items: [
        { name: 'iPhone 15 Pro Max 256GB', quantity: 1, price: 34990000 }
      ],
      shipping_address: '456 Lê Lợi, Q.1, TP.HCM', payment_method: 'Banking'
    },
    {
      id: 3, order_id: 'ORD003', customer_name: 'Lê Minh C', customer_email: 'leminhc@gmail.com',
      shop_name: 'Beauty Corner', total: 1100000, status: 'Confirmed', created_at: '2024-04-21 11:45',
      items: [
        { name: 'Son môi MAC Ruby Woo', quantity: 1, price: 650000 },
        { name: 'Kem chống nắng Anessa', quantity: 1, price: 450000 }
      ],
      shipping_address: '789 Trần Hưng Đạo, Q.5, TP.HCM', payment_method: 'E-Wallet'
    },
    {
      id: 4, order_id: 'ORD004', customer_name: 'Phạm Văn D', customer_email: 'phamvand@gmail.com',
      shop_name: 'Sports Zone', total: 2890000, status: 'Pending', created_at: '2024-04-22 08:00',
      items: [
        { name: 'Giày Nike Air Max', quantity: 1, price: 2890000 }
      ],
      shipping_address: '321 Võ Văn Tần, Q.3, TP.HCM', payment_method: 'COD'
    },
    {
      id: 5, order_id: 'ORD005', customer_name: 'Hoàng E', customer_email: 'hoange@gmail.com',
      shop_name: 'Home & Living', total: 3980000, status: 'Cancelled', created_at: '2024-04-19 16:20',
      items: [
        { name: 'Bàn làm việc gỗ', quantity: 2, price: 1990000 }
      ],
      shipping_address: '654 Hai Bà Trưng, Q.1, TP.HCM', payment_method: 'Banking',
      cancel_reason: 'Khách hủy đơn'
    },
    {
      id: 6, order_id: 'ORD006', customer_name: 'Vũ Thị F', customer_email: 'vuthif@gmail.com',
      shop_name: 'Fashion House', total: 897000, status: 'Delivered', created_at: '2024-04-18 10:30',
      items: [
        { name: 'Áo thun nam basic', quantity: 3, price: 299000 }
      ],
      shipping_address: '987 Nguyễn Thị Minh Khai, Q.3, TP.HCM', payment_method: 'COD'
    },
    {
      id: 7, order_id: 'ORD007', customer_name: 'Nguyễn Văn G', customer_email: 'nguyenvang@gmail.com',
      shop_name: 'Tech World', total: 8990000, status: 'Refunded', created_at: '2024-04-17 14:00',
      items: [
        { name: 'Tai nghe Sony WH-1000XM5', quantity: 1, price: 8990000 }
      ],
      shipping_address: '147 Đinh Tiên Hoàng, Q.Bình Thạnh, TP.HCM', payment_method: 'Banking',
      refund_reason: 'Sản phẩm lỗi'
    },
    {
      id: 8, order_id: 'ORD008', customer_name: 'Trần Văn H', customer_email: 'tranvanh@gmail.com',
      shop_name: 'Beauty Corner', total: 650000, status: 'Shipped', created_at: '2024-04-22 07:30',
      items: [
        { name: 'Son môi MAC Ruby Woo', quantity: 1, price: 650000 }
      ],
      shipping_address: '258 Cách Mạng Tháng 8, Q.10, TP.HCM', payment_method: 'E-Wallet'
    }
  ];

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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
