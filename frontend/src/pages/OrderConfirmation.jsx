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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order not found</h2>
          <Link to="/" className="text-primary-600 hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  const estimatedTime = new Date(order.estimatedDeliveryTime).toLocaleTimeString();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          
          <div className="bg-pastel-green rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Order ID:</span> {order.orderId}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Status:</span> {order.status.replace('_', ' ').toUpperCase()}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Estimated Delivery:</span> {estimatedTime}
            </p>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Order Details</h2>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition"
            >
              View Orders
            </Link>
            <Link
              to="/"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
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

