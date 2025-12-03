import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CheckoutVoucherSection,
  CheckoutProductsSection,
  CheckoutShippingSection,
  CheckoutPaymentSection,
  CheckoutSummary
} from './checkout';
import checkoutStyles from './checkout/checkoutStyles';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // Get checkout items from location state or use default
  const [checkoutItems] = useState(location.state?.items || [
    {
      item_id: 1,
      product_id: 1,
      product_name: 'Áo thun nam cotton cao cấp Premium',
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop',
      color: 'Trắng',
      type: 'L',
      price: 129000,
      quantity: 2,
      shop: {
        shop_id: 1,
        shop_name: 'Cửa hàng Kim Tín'
      }
    },
    {
      item_id: 2,
      product_id: 3,
      product_name: 'Giày thể thao nam sneaker',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      color: 'Đỏ',
      type: '42',
      price: 449000,
      quantity: 1,
      shop: {
        shop_id: 1,
        shop_name: 'Cửa hàng Kim Tín'
      }
    }
  ]);

  // Shipping options
  const shippingOptions = [
    {
      shipping_id: 1,
      name: 'Giao hàng tiêu chuẩn',
      estimated_days: 5,
      fee: 30000,
      status: 'Active'
    },
    {
      shipping_id: 2,
      name: 'Giao hàng nhanh',
      estimated_days: 2,
      fee: 50000,
      status: 'Active'
    },
    {
      shipping_id: 3,
      name: 'Giao hỏa tốc',
      estimated_days: 1,
      fee: 80000,
      status: 'Active'
    }
  ];

  // Vouchers
  const availableVouchers = [
    {
      voucher_id: 1,
      code: 'GIAM10',
      discount_type: 'Percentage',
      discount_value: 10,
      min_order_value: 200000,
      expired_date: '2025-12-31',
      usage_limit: 100,
      used_count: 45,
      status: 'Active'
    },
    {
      voucher_id: 2,
      code: 'GIAM50K',
      discount_type: 'Amount',
      discount_value: 50000,
      min_order_value: 500000,
      expired_date: '2025-12-31',
      usage_limit: 50,
      used_count: 20,
      status: 'Active'
    }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'COD', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
    { id: 'Banking', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
    { id: 'Momo', name: 'Ví MoMo', icon: '📱' },
    { id: 'ZaloPay', name: 'ZaloPay', icon: '💳' }
  ];

  // State
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [voucherCode, setVoucherCode] = useState('');
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [note, setNote] = useState('');

  // Calculations
  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = selectedShipping.fee;
  
  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;
    if (subtotal < selectedVoucher.min_order_value) return 0;
    
    if (selectedVoucher.discount_type === 'Percentage') {
      return Math.floor(subtotal * selectedVoucher.discount_value / 100);
    } else {
      return selectedVoucher.discount_value;
    }
  };
  
  const discount = calculateDiscount();
  const totalAmount = subtotal + shippingFee - discount;

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const handleApplyVoucher = (voucher = null) => {
    if (voucher) {
      if (subtotal < voucher.min_order_value) {
        alert(`Đơn hàng tối thiểu ${formatPrice(voucher.min_order_value)} để sử dụng voucher này`);
        return;
      }
      setSelectedVoucher(voucher);
      setShowVoucherDropdown(false);
    } else {
      const foundVoucher = availableVouchers.find(v => 
        v.code.toUpperCase() === voucherCode.toUpperCase() && 
        v.status === 'Active' &&
        v.used_count < v.usage_limit
      );
      
      if (foundVoucher) {
        if (subtotal < foundVoucher.min_order_value) {
          alert(`Đơn hàng tối thiểu ${formatPrice(foundVoucher.min_order_value)} để sử dụng voucher này`);
          return;
        }
        setSelectedVoucher(foundVoucher);
        setShowVoucherDropdown(false);
      } else {
        alert('Mã voucher không hợp lệ hoặc đã hết lượt sử dụng');
      }
    }
  };

  const handlePlaceOrder = () => {
    if (!shippingAddress.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    // Generate a mock order ID
    const orderId = Date.now();

    const orderData = {
      order_id: orderId,
      customer_id: user?.id,
      customer_name: user?.name || 'Khách hàng',
      shipping_id: selectedShipping.shipping_id,
      voucher_id: selectedVoucher?.voucher_id || null,
      status: 'Processing',
      shipping_address: shippingAddress,
      shipping_method: selectedShipping,
      total_price: totalAmount,
      subtotal: subtotal,
      shipping_fee: shippingFee,
      discount: discount,
      payment_method: selectedPayment,
      voucher: selectedVoucher,
      note: note,
      created_at: new Date().toISOString(),
      items: checkoutItems.map(item => {
        // Calculate price_at_purchase: giá sau khi áp dụng giảm giá (chia đều cho các item)
        const discountPerItem = discount / checkoutItems.reduce((sum, i) => sum + i.quantity, 0);
        const priceAfterDiscount = item.price - discountPerItem;
        
        return {
          order_item_id: Date.now() + Math.random(),
          variantID: item.item_id, // theo database schema
          product_id: item.product_id,
          product_name: item.product_name,
          image_url: item.image_url,
          color: item.color,
          type: item.type,
          quantity: item.quantity,
          price: item.price, // giá gốc
          price_at_purchase: priceAfterDiscount > 0 ? priceAfterDiscount : item.price, // giá sau giảm
          shop_id: item.shop.shop_id,
          shop_name: item.shop.shop_name
        };
      })
    };

    console.log('Order data:', orderData);
    
    // Navigate to order confirmation page
    navigate(`/order/confirmation/${orderId}`, { 
      state: { 
        order: orderData, 
        isNewOrder: true 
      } 
    });
  };

  // Group items by shop
  const groupedByShop = checkoutItems.reduce((acc, item) => {
    const shopId = item.shop.shop_id;
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: item.shop,
        items: []
      };
    }
    acc[shopId].items.push(item);
    return acc;
  }, {});

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={checkoutStyles.page}>
      <div style={checkoutStyles.container}>
        <h1 style={checkoutStyles.pageTitle}>Thanh Toán</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
          {/* Left Column */}
          <div>
            {/* Shipping Address */}
            <div style={checkoutStyles.section}>
              <h2 style={checkoutStyles.sectionTitle}>
                <span>📍</span> Địa Chỉ Nhận Hàng
              </h2>
              <div style={checkoutStyles.userInfo}>
                <span><strong>{user?.fullName || user?.full_name}</strong></span>
                <span>{user?.phone}</span>
              </div>
              <input
                type="text"
                placeholder="Nhập địa chỉ giao hàng..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={checkoutStyles.addressInput}
              />
            </div>

            {/* Products */}
            <CheckoutProductsSection
              groupedByShop={groupedByShop}
              styles={checkoutStyles}
              formatPrice={formatPrice}
            />

            {/* Shipping Method */}
            <CheckoutShippingSection
              shippingOptions={shippingOptions}
              selectedShipping={selectedShipping}
              onSelectShipping={setSelectedShipping}
              styles={checkoutStyles}
              formatPrice={formatPrice}
            />

            {/* Payment Method */}
            <CheckoutPaymentSection
              paymentMethods={paymentMethods}
              selectedPayment={selectedPayment}
              onSelectPayment={setSelectedPayment}
              styles={checkoutStyles}
            />

            {/* Note */}
            <div style={checkoutStyles.section}>
              <h2 style={checkoutStyles.sectionTitle}>
                <span>📝</span> Ghi Chú
              </h2>
              <textarea
                placeholder="Lời nhắn cho người bán..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={checkoutStyles.noteTextarea}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            {/* Voucher */}
            <CheckoutVoucherSection
              selectedVoucher={selectedVoucher}
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              showVoucherDropdown={showVoucherDropdown}
              setShowVoucherDropdown={setShowVoucherDropdown}
              availableVouchers={availableVouchers}
              subtotal={subtotal}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={() => {
                setSelectedVoucher(null);
                setVoucherCode('');
              }}
              styles={checkoutStyles}
              formatPrice={formatPrice}
            />

            {/* Order Summary */}
            <CheckoutSummary
              checkoutItems={checkoutItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discount={discount}
              totalAmount={totalAmount}
              selectedVoucher={selectedVoucher}
              onPlaceOrder={handlePlaceOrder}
              styles={checkoutStyles}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
