import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CheckoutVoucherSection,
  CheckoutProductsSection,
  CheckoutShippingSection,
  CheckoutPaymentSection,
  CheckoutSummary
} from './checkout';
import checkoutStyles from './checkout/checkoutStyles';
import { cartService } from '../api/cartService.js';
import { orderService } from '../api/orderService.js';
import { shippingService } from '../api/shippingService.js';
import { voucherService } from '../api/voucherService.js';
import createPrivateClient from '../clients/private.client.js';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const privateClient = token ? createPrivateClient(dispatch) : null;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  // States
  const [checkoutItems, setCheckoutItems] = useState(location.state?.items || []);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [voucherCode, setVoucherCode] = useState('');
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch shipping methods and vouchers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If no items from location state, fetch from cart
        if (checkoutItems.length === 0 && privateClient) {
          const cartRes = await cartService.getCart(privateClient);
          setCheckoutItems(cartRes.data?.data?.items || []);
        }
        
        // Fetch shipping methods
        const shippingRes = await shippingService.getShippingMethods();
        const shippingData = shippingRes.data?.data || [];
        setShippingOptions(shippingData);
        if (shippingData.length > 0) {
          setSelectedShipping(shippingData[0]);
        }

        // Fetch vouchers
        const voucherRes = await voucherService.getVouchers();
        setVouchers(voucherRes.data?.data || []);
      } catch (err) {
        console.error('Error fetching checkout data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Payment methods
  const paymentMethods = [
    { id: 'COD', name: 'Cash on Delivery (COD)', icon: '💵' },
    { id: 'Banking', name: 'Bank Transfer', icon: '🏦' },
    { id: 'Momo', name: 'MoMo Wallet', icon: '📱' },
    { id: 'ZaloPay', name: 'ZaloPay', icon: '💳' }
  ];

  // Calculations
  const subtotal = checkoutItems.reduce((sum, item) => sum + ((item.price_at_purchase || item.price) * item.quantity), 0);
  const shippingFee = selectedShipping?.fee || 0;
  
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
    return (price || 0).toLocaleString('vi-VN') + 'đ';
  };

  const handleApplyVoucher = () => {
    if (voucherCode.trim()) {
      const foundVoucher = vouchers.find(v => v.code.toLowerCase() === voucherCode.toLowerCase());
      
      if (foundVoucher) {
        if (subtotal < foundVoucher.min_order_value) {
          alert(`Minimum order ${formatPrice(foundVoucher.min_order_value)} to use this voucher`);
          return;
        }
        setSelectedVoucher(foundVoucher);
        setShowVoucherDropdown(false);
      } else {
        alert('Invalid voucher code or usage limit reached');
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    try {
      const orderData = {
        shipping_id: selectedShipping?.shipping_id,
        voucher_id: selectedVoucher?.voucher_id || null,
        payment_method: selectedPayment,
        shipping_address: user?.address || shippingAddress,
        note: note
      };

      const response = await orderService.createOrder(orderData, privateClient);
      
      if (response.data?.success) {
        navigate('/order-confirmation/' + response.data.data.order_id, {
          state: {
            order: {
              ...response.data.data,
              items: checkoutItems,
              shipping: selectedShipping,
              voucher: selectedVoucher,
              subtotal,
              shipping_fee: shippingFee,
              discount,
              total_amount: totalAmount
            }
          }
        });
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Error placing order: ' + (err.response?.data?.message || err.message));
    }
  };

  // Group items by shop
  const groupedByShop = checkoutItems.reduce((acc, item) => {
    const shopId = item.shop?.shop_id || item.shop_id;
    if (!acc[shopId]) {
      acc[shopId] = {
        shop: item.shop || { shop_id: shopId, shop_name: item.shop_name },
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
                <span>📍</span> Shipping Address
              </h2>
              <div style={checkoutStyles.userInfo}>
                <span><strong>{user?.fullName || user?.full_name}</strong></span>
                <span>{user?.phone}</span>
              </div>
              <input
                type="text"
                placeholder="Enter shipping address..."
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
                <span>📝</span> Note
              </h2>
              <textarea
                placeholder="Message for the seller..."
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
