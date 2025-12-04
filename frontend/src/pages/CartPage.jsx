import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CartShopGroup, CartCheckoutFooter, EmptyCart } from './cart';
import cartStyles from './cart/cartStyles';
import { fetchCart } from '../redux/slice/cart.slice.js';
import createPrivateClient from '../clients/private.client.js';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatchRedux = useDispatch();
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const { shops: reduxShops, loading: reduxLoading } = useSelector(state => state.cart);
  const privateClient = useMemo(() => token ? createPrivateClient(dispatchRedux) : null, [token, dispatchRedux]);

  const [selectedItems, setSelectedItems] = useState(new Set());

  // Fetch cart on mount or when token changes
  useEffect(() => {
    if (isAuthenticated && privateClient) {
      console.log('📄 CartPage: Fetching cart');
      dispatchRedux(fetchCart(privateClient));
    }
  }, [isAuthenticated, privateClient, dispatchRedux]);

  if (!isAuthenticated) {
    return (
      <div style={{ ...cartStyles.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Please log in to view your cart</h2>
          <button onClick={() => navigate('/signin')}>Log In</button>
        </div>
      </div>
    );
  }

  if (reduxLoading) {
    return (
      <div style={{ ...cartStyles.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (!reduxShops || reduxShops.length === 0) {
    return (
      <div style={cartStyles.page}>
        <div style={cartStyles.container}>
          <h1 style={cartStyles.pageTitle}>Cart</h1>
          <EmptyCart styles={cartStyles} />
        </div>
      </div>
    );
  }

  const handleQuantityChange = (itemId, action) => {
    // This will need to be handled via API
    console.log('Quantity change:', itemId, action);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allItemIds = new Set();
    reduxShops.forEach(shop => {
      shop.items?.forEach(item => {
        allItemIds.add(item.item_id);
      });
    });
    
    if (allItemIds.size === selectedItems.size) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(allItemIds);
    }
  };

  const handleSelectShop = (shopId) => {
    const shopItems = reduxShops.find(s => s.shop_id === shopId)?.items || [];
    const shopItemIds = new Set(shopItems.map(item => item.item_id));
    
    // Check if all items in this shop are selected
    const allSelected = shopItems.every(item => selectedItems.has(item.item_id));
    
    const newSet = new Set(selectedItems);
    if (allSelected) {
      shopItemIds.forEach(id => newSet.delete(id));
    } else {
      shopItemIds.forEach(id => newSet.add(id));
    }
    setSelectedItems(newSet);
  };

  const handleRemoveItem = (itemId) => {
    // This will need to be handled via API
    console.log('Remove item:', itemId);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    if (selectedItems.size === 0) {
      alert('Please select products to checkout');
      return;
    }
    
    const checkoutItems = [];
    reduxShops.forEach(shop => {
      shop.items?.forEach(item => {
        if (selectedItems.has(item.item_id)) {
          checkoutItems.push({
            item_id: item.item_id,
            product_id: item.product_id,
            product_name: item.product_name,
            image_url: item.variant_image || item.product_image,
            color: item.color || '',
            type: item.type || '',
            price: item.price,
            quantity: item.quantity,
            shop: {
              shop_id: shop.shop_id,
              shop_name: shop.shop_name
            }
          });
        }
      });
    });
    
    navigate('/checkout', { state: { items: checkoutItems } });
  };

  const totalItems = reduxShops.reduce((sum, shop) => sum + (shop.items?.length || 0), 0);

  return (
    <div style={cartStyles.page}>
      <div style={cartStyles.container}>
        <h1 style={cartStyles.pageTitle}>Cart ({totalItems} items)</h1>

        {/* Cart Items grouped by Shop */}
        {reduxShops.map((shop) => (
          <CartShopGroup
            key={shop.shop_id}
            shop={{
              id: shop.shop_id,
              name: shop.shop_name,
              status: shop.shop_status
            }}
            items={shop.items || []}
            selectedItems={selectedItems}
            onQuantityChange={handleQuantityChange}
            onSelect={handleSelectItem}
            onRemove={handleRemoveItem}
            onSelectShop={handleSelectShop}
            styles={cartStyles}
          />
        ))}
      </div>

      {/* Checkout Footer */}
      <CartCheckoutFooter
        cartItems={reduxShops}
        selectedItems={Array.from(selectedItems)}
        selectedCount={selectedItems.size}
        onSelectAll={handleSelectAll}
        onCheckout={handleCheckout}
        styles={cartStyles}
      />
    </div>
  );
};

export default CartPage;
