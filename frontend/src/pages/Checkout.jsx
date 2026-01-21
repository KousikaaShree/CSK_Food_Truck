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
    try {
      const orderData = {
        address: formData,
        paymentMethod,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      };

      const res = await axios.post(
        '/api/orders/create',
        orderData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      await clearCart();
      navigate(`/order-confirmation/${res.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Delivery Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={loading}
                className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition disabled:opacity-50 font-semibold shadow-soft ring-1 ring-csk-yellow/60"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

