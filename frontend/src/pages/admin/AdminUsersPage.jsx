import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import adminStyles from './adminStyles.js';
import { adminService } from '../../api/adminService.js';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import createPrivateClient from '../../clients/private.client';

const AdminUsersPage = () => {
  const { token } = useSelector(state => state.auth);
  const privateClient = createPrivateClient(token);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAllUsers(privateClient, {
          role: roleFilter === 'all' ? undefined : roleFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
          search: searchTerm || undefined
        });
        if (response.data?.data?.users) {
          setUsers(response.data.data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token, roleFilter, statusFilter, searchTerm]);

  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.account_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, status: user.status === 'Active' ? 'Ban' : 'Active' };
      }
      return user;
    }));
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const styles = {
    ...adminStyles,
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    filterRow: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      minWidth: '150px',
      outline: 'none',
      cursor: 'pointer'
    },
    infoRow: {
      display: 'flex',
      padding: '12px 0',
      borderBottom: '1px solid #f0f0f0',
      alignItems: 'center'
    },
    infoLabel: {
      width: '140px',
      color: '#666',
      fontSize: '14px'
    },
    infoValue: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    },
    statBox: {
      backgroundColor: '#f8f9fa',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center'
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Admin': return 'info';
      case 'Shop': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={styles.headerRow}>
        <h1 style={adminStyles.pageTitle}>Quản lý Users</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Tổng: <strong>{users.length}</strong> tài khoản
        </div>
      </div>

      {/* Filters */}
      <div style={adminStyles.card}>
        <div style={styles.filterRow}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <Input
              placeholder="🔍 Tìm kiếm theo email, tên, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Customer">Customer</option>
            <option value="Shop">Shop</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Active</option>
            <option value="Ban">Banned</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={adminStyles.table}>
            <thead>
              <tr>
                <th style={adminStyles.th}>ID</th>
                <th style={adminStyles.th}>Email</th>
                <th style={adminStyles.th}>Tên</th>
                <th style={adminStyles.th}>Vai trò</th>
                <th style={adminStyles.th}>Trạng thái</th>
                <th style={adminStyles.th}>Ngày tạo</th>
                <th style={adminStyles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={adminStyles.td}>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{user.account_id}</span>
                  </td>
                  <td style={adminStyles.td}>{user.email}</td>
                  <td style={adminStyles.td}>
                    <strong>{user.full_name}</strong>
                  </td>
                  <td style={adminStyles.td}>
                    <Badge variant={getRoleBadgeVariant(user.role)} size="small">
                      {user.role}
                    </Badge>
                  </td>
                  <td style={adminStyles.td}>
                    <Badge 
                      variant={user.status === 'Active' ? 'success' : 'danger'} 
                      size="small"
                    >
                      {user.status === 'Active' ? '✓ Active' : '✕ Banned'}
                    </Badge>
                  </td>
                  <td style={adminStyles.td}>
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={adminStyles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        variant="primary"
                        size="small"
                        icon="👁️"
                        onClick={() => handleViewUser(user)}
                      >
                        Xem
                      </Button>
                      {user.role !== 'Admin' && (
                        <Button
                          variant={user.status === 'Active' ? 'danger' : 'success'}
                          size="small"
                          icon={user.status === 'Active' ? '🚫' : '✓'}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.status === 'Active' ? 'Ban' : 'Unban'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Không tìm thấy user nào
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Chi tiết User"
          size="medium"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Đóng
              </Button>
              {selectedUser.role !== 'Admin' && (
                <Button
                  variant={selectedUser.status === 'Active' ? 'danger' : 'success'}
                  icon={selectedUser.status === 'Active' ? '🚫' : '✓'}
                  onClick={() => {
                    handleToggleStatus(selectedUser.id);
                    setShowModal(false);
                  }}
                >
                  {selectedUser.status === 'Active' ? 'Ban User' : 'Unban User'}
                </Button>
              )}
            </div>
          }
        >
          <>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Account ID</span>
              <span style={styles.infoValue}>{selectedUser.account_id}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{selectedUser.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Họ tên</span>
              <span style={styles.infoValue}>{selectedUser.full_name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Vai trò</span>
              <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                {selectedUser.role}
              </Badge>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Trạng thái</span>
              <Badge variant={selectedUser.status === 'Active' ? 'success' : 'danger'}>
                {selectedUser.status}
              </Badge>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Ngày tạo</span>
              <span style={styles.infoValue}>
                {new Date(selectedUser.created_at).toLocaleDateString('vi-VN')}
              </span>
            </div>

            {selectedUser.role === 'Customer' && (
              <div style={styles.statsRow}>
                <div style={styles.statBox}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3498db' }}>
                    {selectedUser.total_orders}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Đơn hàng</div>
                </div>
                <div style={styles.statBox}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c' }}>
                    {formatCurrency(selectedUser.total_spent)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Tổng chi tiêu</div>
                </div>
              </div>
            )}

          {selectedUser.role === 'Shop' && (
            <div style={styles.statsRow}>
              <div style={styles.statBox}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3498db' }}>
                  {selectedUser.total_orders}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Đơn hoàn thành</div>
              </div>
              <div style={styles.statBox}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c' }}>
                  ⭐ 4.8
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Đánh giá</div>
              </div>
            </div>
          )}
        </>
      </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;
