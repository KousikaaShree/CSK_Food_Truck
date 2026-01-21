import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrder(res.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
        <div className="text-center bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 px-8 py-10">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/" className="text-csk-yellow hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  const estimatedTime = new Date(order.estimatedDeliveryTime).toLocaleTimeString();

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-csk-yellow mb-4">Order Placed Successfully!</h1>
          
          <div className="bg-[#18181f] rounded-lg p-6 mb-6 ring-1 ring-csk-yellow/40">
            <p className="text-lg text-gray-200 mb-2">
              <span className="font-semibold">Order ID:</span> {order.orderId}
            </p>
            <p className="text-lg text-gray-200 mb-2">
              <span className="font-semibold">Status:</span> {order.status.replace('_', ' ').toUpperCase()}
            </p>
            <p className="text-lg text-gray-200">
              <span className="font-semibold">Estimated Delivery:</span> {estimatedTime}
            </p>
          </div>

          <div className="text-left bg-[#18181f] rounded-lg p-6 mb-6">
            <h2 className="font-bold text-white mb-3">Order Details</h2>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2 text-sm text-gray-200">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between font-bold text-csk-yellow">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-csk-yellow text-[#0b0b0f] px-6 py-3 rounded-full hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60 text-sm font-semibold"
            >
              View Orders
            </Link>
            <Link
              to="/"
              className="bg-[#18181f] text-gray-200 px-6 py-3 rounded-full hover:bg-[#23232c] transition text-sm font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

