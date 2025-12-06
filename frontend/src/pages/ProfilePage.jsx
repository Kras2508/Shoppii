import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ProfileHeader,
  ProfileStats,
  ProfileOrders,
  ProfileStatistics,
  ProfileReviews,
  ProfileEdit,
  profileStyles
} from './profile';
import { authService } from '../api/authService.js';
import { orderService } from '../api/orderService.js';
import { customerService } from '../api/customerService.js';
import createPrivateClient from '../clients/private.client.js';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = token ? createPrivateClient(dispatch) : null;
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile, orders and statistics data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !privateClient) return;

      try {
        setLoading(true);
        const [profileRes, ordersRes, statsRes] = await Promise.all([
          authService.getProfile(privateClient),
          orderService.getOrders(privateClient, { limit: 50 }),
          customerService.getStatistics(privateClient)
        ]);

        setProfileData(profileRes.data?.data);
        setOrders(ordersRes.data?.data?.orders || []);
        setStatistics(statsRes.data?.data || null);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ ...profileStyles.page, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ ...profileStyles.page, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Cannot load profile information</h2>
      </div>
    );
  }

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status.toLowerCase() === orderFilter.toLowerCase();
  });

  // Use statistics from API (Part 2 functions) or fallback to calculated
  const stats = {
    total_order: statistics?.total_orders || orders.length,
    total_spent: statistics?.total_spent || profileData.total_spent || 0,
    delivered_orders: statistics?.delivered_count || orders.filter(o => o.status === 'Delivered').length,
    total_reviews: statistics?.review_count || 0
  };

  const tabs = [
    { key: 'orders', label: '📦 Orders', count: orders.length },
    { key: 'statistics', label: '📊 Statistics' },
    { key: 'reviews', label: '⭐ Reviews', count: statistics?.review_count },
    { key: 'settings', label: '⚙️ Settings' }
  ];

  const formatPrice = (price) => {
    const value = Number(price ?? 0);
    return Math.floor(value).toLocaleString('vi-VN') + ' VND';
  };

  const handleSaveProfile = async (formData) => {
    try {
      // Update basic profile info
      const profileUpdateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        add_phone: formData.add_phone,
        address: formData.address,
      };
      
      await authService.updateProfile(profileUpdateData, privateClient);
      
      // Change password if provided
      if (formData.current_password && formData.new_password) {
        await authService.changePassword({
          current_password: formData.current_password,
          new_password: formData.new_password
        }, privateClient);
        alert('Profile and password updated successfully!');
      } else {
        alert('Profile updated successfully!');
      }
      
      setIsEditing(false);
      // Refresh profile data
      const profileRes = await authService.getProfile(privateClient);
      setProfileData(profileRes.data?.data);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.message || 'Error updating profile information');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={profileStyles.container}>
      {/* Profile Header */}
      <ProfileHeader
        user={profileData}
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
              orders={orders}
              filter={orderFilter}
              setFilter={setOrderFilter}
              styles={profileStyles}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === 'statistics' && !isEditing && (
            <ProfileStatistics
              stats={stats}
              statistics={statistics}
              orders={orders}
              styles={profileStyles}
              formatPrice={formatPrice}
            />
          )}

          {activeTab === 'reviews' && !isEditing && (
            <ProfileReviews
              styles={profileStyles}
              privateClient={privateClient}
            />
          )}

          {activeTab === 'settings' && !isEditing && (
            <ProfileEdit
              user={profileData}
              styles={profileStyles}
              onSave={handleSaveProfile}
              onCancel={() => setActiveTab('orders')}
            />
          )}

          {isEditing && (
            <ProfileEdit
              user={profileData}
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
