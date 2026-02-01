import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullAddress: '',
    city: '',
    area: '',
    pincode: '',
    mobile: user?.mobile || ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cart?.total || 0;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sync frontend cart to backend before placing order
  const syncCartToBackend = async () => {
    if (!user || !cart.items || cart.items.length === 0) {
      return;
    }

    try {
      // Clear backend cart first (ignore error if cart doesn't exist)
      try {
        await axios.delete('/api/cart/clear', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (clearError) {
        // Cart might not exist yet, that's okay
        console.log('Cart clear note:', clearError.response?.status);
      }

      // Add all items from frontend cart to backend
      // Skip items that can't be synced (e.g., custom frontend IDs) - we'll use frontend cart in order creation
      let syncedCount = 0;
      for (const item of cart.items) {
        // Extract food ID - handle both id and _id properties
        const foodId = item.food?.id || item.food?._id || item.foodId;
        
        // Only try to sync if foodId looks like a MongoDB ObjectId
        // Frontend custom IDs (like 'seed-1') will be skipped and handled in order creation
        if (!foodId || typeof foodId !== 'string' || !foodId.match(/^[0-9a-fA-F]{24}$/)) {
          console.log('Skipping sync for item with custom ID:', item.food?.name, foodId);
          continue; // Skip this item, will use frontend cart in order creation
        }

        try {
          // Ensure customizationData has the right structure
          const customizationData = {
            addOns: item.customizationData?.addOns || []
          };

          const response = await axios.post(
            '/api/cart/add',
            {
              foodId: String(foodId),
              quantity: item.quantity,
              customizationData,
              cartItemId: item.cartItemId
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );

          if (response.status === 200) {
            syncedCount++;
          }
        } catch (itemError) {
          // If individual item fails, log but continue with other items
          console.warn('Failed to sync item to backend:', item.food?.name, itemError.response?.data?.message);
          // Continue with next item - we'll use frontend cart in order creation
        }
      }
      
      // If no items were synced, that's okay - we'll use frontend cart items
      if (syncedCount === 0) {
        console.log('No items synced to backend, will use frontend cart items for order');
      }
    } catch (error) {
      console.error('Error syncing cart to backend:', error);
      // Don't throw - we'll use frontend cart items as fallback
      console.log('Will use frontend cart items for order creation');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      const res = await axios.post(
        '/api/payment/create-order',
        { amount: total },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'CSK Food Truck',
        description: 'Food Order Payment',
        order_id: res.data.orderId,
        handler: async (response) => {
          await createOrder(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: formData.mobile
        },
        theme: {
          color: '#F5C400'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError('Payment initialization failed');
      console.error(error);
    }
  };

  const createOrder = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    setLoading(true);
    setError('');
    
    try {
      // Validate cart is not empty
      if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        setError('Your cart is empty. Please add items to your cart before placing an order.');
        setLoading(false);
        return;
      }

      // Try to sync frontend cart to backend (but don't fail if it doesn't work)
      if (user) {
        try {
          await syncCartToBackend();
        } catch (syncError) {
          console.warn('Cart sync failed, will use frontend cart items:', syncError);
          // Continue anyway - we'll send cart items directly
        }
      }

      // Prepare cart items for backend (as fallback if sync failed)
      const cartItemsForBackend = cart.items
        .filter(item => item && item.food) // Filter out invalid items
        .map(item => {
          const foodId = item.food?.id || item.food?._id || item.foodId;
          const foodName = item.food?.name;
          
          if (!foodId && !foodName) {
            console.error('Missing food ID and name in cart item:', item);
            return null;
          }
          
          return {
            foodId: foodId ? String(foodId) : null,
            food: item.food, // Include full food object as backup
            name: foodName, // Include name for lookup
            quantity: item.quantity || 1,
            price: item.price || 0,
            customizationData: item.customizationData || { addOns: [] }
          };
        })
        .filter(item => item !== null); // Remove null items

      // Validate we have valid cart items
      if (cartItemsForBackend.length === 0) {
        setError('No valid items found in cart. Please add items to your cart.');
        setLoading(false);
        return;
      }

      const orderData = {
        address: formData,
        paymentMethod,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        cartItems: cartItemsForBackend // Send cart items as fallback
      };

      const res = await axios.post(
        '/api/orders/create',
        orderData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      await clearCart();
      navigate(`/order-confirmation/${res.data._id}`);
    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.response?.data?.message || error.message || 'Order creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate cart is not empty
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      setError('Your cart is empty. Please add items to your cart before placing an order.');
      return;
    }

    if (paymentMethod === 'razorpay') {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Failed to load payment gateway');
        return;
      }
      await handleRazorpayPayment();
    } else {
      // Cash on Delivery
      await createOrder(null, null, null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-csk-yellow mb-8">Checkout</h1>

        {error && (
          <div className="bg-[#2b1818] border border-[#fca5a5] text-[#fecaca] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {(!cart || !Array.isArray(cart.items) || cart.items.length === 0) && (
          <div className="bg-[#2b1818] border border-[#fca5a5] text-[#fecaca] px-4 py-3 rounded mb-4">
            <p className="font-semibold">Cart is empty</p>
            <p className="text-sm mt-1">Please add items to your cart before placing an order.</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-3 bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-lg hover:bg-csk-yellowSoft transition font-semibold"
            >
              Go to Menu
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4" style={{ opacity: (!cart || !Array.isArray(cart.items) || cart.items.length === 0) ? 0.5 : 1 }}>
              <div>
                <label className="block text-gray-200 mb-2">Full Address</label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-200 mb-2">Payment Method</label>
                <div className="space-y-2 text-sm text-gray-200">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Razorpay (Online Payment)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash on Delivery
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !cart || !Array.isArray(cart.items) || cart.items.length === 0}
                className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-soft ring-1 ring-csk-yellow/60"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
            
            {cart && Array.isArray(cart.items) && cart.items.length > 0 ? (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item, index) => (
                    <div key={item.cartItemId || index} className="flex justify-between items-start pb-3 border-b border-white/10">
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.food?.name || 'Item'}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price?.toFixed(2) || '0.00'}</p>
                        {item.customizationData?.addOns && item.customizationData.addOns.length > 0 && (
                          <p className="text-gray-500 text-xs mt-1">
                            Add-ons: {item.customizationData.addOns.map(a => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-200 font-semibold ml-4">
                        ₹{((item.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-semibold text-gray-100">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (18% GST)</span>
                    <span className="font-semibold text-gray-100">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-csk-yellow">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No items in cart</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

