import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ProfileHeader,
  ProfileStats,
  ProfileOrders,
  ProfileStatistics,
  ProfileEdit,
  profileStyles
} from './profile';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // Mock user data based on database schema (Customer + Account)
  const mockUser = {
    customer_id: 1,
    account_id: 1,
    email: user?.email || 'nguyenvana@gmail.com',
    full_name: user?.name || 'Nguyễn Văn A',
    phone: '0901234567',
    add_phone: '0912345678',
    address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    status: 'Active',
    role: 'Customer',
    total_spent: 15750000, // từ fn_get_customer_total_spent
    total_order: 12,
    created_at: '2024-06-15T10:30:00'
  };

  // Mock orders data based on database schema
  const mockOrders = [
    {
      order_id: 1001,
      customer_id: 1,
      shipping_id: 2,
      voucher_id: 1,
      status: 'Delivered',
      order_date: '2024-11-28T14:30:00',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      total_amount: 707000, // fn_calculate_order_total result
      payment_method: 'COD',
      created_at: '2024-11-28T14:30:00',
      shops: ['Cửa hàng Kim Tín'],
      items: [
        {
          order_item_id: 1,
          variantID: 1,
          product_id: 1,
          product_name: 'Áo thun nam cotton cao cấp Premium',
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
          color: 'Trắng',
          type: 'L',
          quantity: 2,
          price: 129000,
          price_at_purchase: 129000,
          shop_id: 1,
          category_name: 'Thời trang nam'
        },
        {
          order_item_id: 2,
          variantID: 3,
          product_id: 3,
          product_name: 'Giày thể thao nam sneaker',
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
          color: 'Đỏ',
          type: '42',
          quantity: 1,
          price: 449000,
          price_at_purchase: 449000,
          shop_id: 1,
          category_name: 'Giày dép'
        }
      ]
    },
    {
      order_id: 1002,
      customer_id: 1,
      shipping_id: 1,
      voucher_id: null,
      status: 'Shipped',
      order_date: '2024-12-01T09:15:00',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      total_amount: 1580000,
      payment_method: 'Banking',
      created_at: '2024-12-01T09:15:00',
      shops: ['TechZone Official'],
      items: [
        {
          order_item_id: 3,
          variantID: 5,
          product_id: 5,
          product_name: 'Tai nghe Bluetooth không dây TWS',
          image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
          color: 'Đen',
          type: 'Pro',
          quantity: 1,
          price: 890000,
          price_at_purchase: 890000,
          shop_id: 2,
          category_name: 'Điện tử'
        },
        {
          order_item_id: 4,
          variantID: 6,
          product_id: 6,
          product_name: 'Ốp lưng iPhone 15 Pro Max',
          image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=200&fit=crop',
          color: 'Trong suốt',
          type: 'MagSafe',
          quantity: 2,
          price: 345000,
          price_at_purchase: 345000,
          shop_id: 2,
          category_name: 'Phụ kiện'
        }
      ]
    },
    {
      order_id: 1003,
      customer_id: 1,
      shipping_id: 3,
      voucher_id: 2,
      status: 'Processing',
      order_date: '2024-12-02T16:45:00',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      total_amount: 2150000,
      payment_method: 'Momo',
      created_at: '2024-12-02T16:45:00',
      shops: ['Fashion House', 'Beauty Store'],
      items: [
        {
          order_item_id: 5,
          variantID: 7,
          product_id: 7,
          product_name: 'Váy đầm nữ phong cách Hàn Quốc',
          image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop',
          color: 'Hồng',
          type: 'M',
          quantity: 1,
          price: 650000,
          price_at_purchase: 585000,
          shop_id: 3,
          category_name: 'Thời trang nữ'
        },
        {
          order_item_id: 6,
          variantID: 8,
          product_id: 8,
          product_name: 'Son môi lì cao cấp',
          image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop',
          color: 'Đỏ cherry',
          type: 'Matte',
          quantity: 3,
          price: 350000,
          price_at_purchase: 315000,
          shop_id: 4,
          category_name: 'Làm đẹp'
        }
      ]
    },
    {
      order_id: 1004,
      customer_id: 1,
      shipping_id: 1,
      voucher_id: null,
      status: 'Cancelled',
      order_date: '2024-11-20T11:00:00',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      total_amount: 450000,
      payment_method: 'COD',
      created_at: '2024-11-20T11:00:00',
      shops: ['Book World'],
      items: [
        {
          order_item_id: 7,
          variantID: 9,
          product_id: 9,
          product_name: 'Sách "Đắc Nhân Tâm"',
          image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=200&fit=crop',
          color: 'Bìa cứng',
          type: 'Tiếng Việt',
          quantity: 2,
          price: 225000,
          price_at_purchase: 225000,
          shop_id: 5,
          category_name: 'Sách'
        }
      ]
    },
    {
      order_id: 1005,
      customer_id: 1,
      shipping_id: 2,
      voucher_id: null,
      status: 'Delivered',
      order_date: '2024-11-15T08:20:00',
      shipping_address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      total_amount: 3200000,
      payment_method: 'Banking',
      created_at: '2024-11-15T08:20:00',
      shops: ['TechZone Official'],
      items: [
        {
          order_item_id: 8,
          variantID: 10,
          product_id: 10,
          product_name: 'Bàn phím cơ gaming RGB',
          image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200&h=200&fit=crop',
          color: 'Đen',
          type: 'Red Switch',
          quantity: 1,
          price: 1800000,
          price_at_purchase: 1800000,
          shop_id: 2,
          category_name: 'Gaming'
        },
        {
          order_item_id: 9,
          variantID: 11,
          product_id: 11,
          product_name: 'Chuột gaming không dây',
          image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
          color: 'Đen',
          type: 'Wireless',
          quantity: 1,
          price: 1400000,
          price_at_purchase: 1400000,
          shop_id: 2,
          category_name: 'Gaming'
        }
      ]
    }
  ];

  // Statistics based on fn_get_customer_total_spent
  const stats = {
    total_order: mockOrders.length,
    total_spent: mockOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0),
    delivered_orders: mockOrders.filter(o => o.status === 'Delivered').length,
    total_reviews: 8
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + 'đ';
  };

  const handleSaveProfile = (formData) => {
    console.log('Saving profile:', formData);
    // TODO: Call API to update profile
    alert('Đã lưu thông tin!');
    setIsEditing(false);
  };

  const tabs = [
    { key: 'orders', label: '📦 Đơn mua', count: mockOrders.length },
    { key: 'statistics', label: '📊 Thống kê' },
    { key: 'settings', label: '⚙️ Cài đặt' }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={profileStyles.container}>
      {/* Profile Header */}
      <ProfileHeader
        user={mockUser}
        styles={profileStyles}
        onEditProfile={() => setIsEditing(true)}
      />

      {/* Quick Stats */}
      <ProfileStats
        stats={stats}
        styles={profileStyles}
        formatPrice={formatPrice}
      />

      {/* Tabs Content */}
      <div style={profileStyles.tabsContainer}>
        {/* Tab Headers */}
        <div style={profileStyles.tabsHeader}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              style={{
                ...profileStyles.tab,
                ...(activeTab === tab.key ? profileStyles.tabActive : {})
              }}
              onClick={() => {
                setActiveTab(tab.key);
                setIsEditing(false);
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  marginLeft: '8px',
                  backgroundColor: activeTab === tab.key ? '#647A67' : '#eee',
                  color: activeTab === tab.key ? '#fff' : '#666',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '12px'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={profileStyles.tabContent}>
          {activeTab === 'orders' && !isEditing && (
            <ProfileOrders
              orders={mockOrders}
              filter={orderFilter}
              setFilter={setOrderFilter}
              styles={profileStyles}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === 'statistics' && !isEditing && (
            <ProfileStatistics
              stats={stats}
              orders={mockOrders}
              styles={profileStyles}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === 'settings' && !isEditing && (
            <ProfileEdit
              user={mockUser}
              styles={profileStyles}
              onSave={handleSaveProfile}
              onCancel={() => setActiveTab('orders')}
            />
          )}

          {isEditing && (
            <ProfileEdit
              user={mockUser}
              styles={profileStyles}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
