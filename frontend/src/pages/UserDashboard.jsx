import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-csk-yellow/20 text-csk-yellow',
      preparing: 'bg-csk-yellow/30 text-csk-yellow',
      out_for_delivery: 'bg-csk-yellow/20 text-csk-yellow',
      delivered: 'bg-csk-yellow/20 text-csk-yellow',
      cancelled: 'bg-gray-500/20 text-gray-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const center = selectedOrder?.deliveryPartner?.currentLocation
    ? {
        lat: selectedOrder.deliveryPartner.currentLocation.lat,
        lng: selectedOrder.deliveryPartner.currentLocation.lng
      }
    : { lat: 28.6139, lng: 77.2090 }; // Default to Delhi

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-csk-yellow mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">No orders yet</h2>
            <Link
              to="/"
              className="bg-csk-yellow text-[#0b0b0f] px-6 py-3 rounded-lg hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 cursor-pointer hover:shadow-lift hover:ring-csk-yellow/60 transition"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-200">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="text-csk-yellow">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-400">+{order.items.length - 2} more items</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-bold text-lg text-white">Total: <span className="text-csk-yellow">₹{order.total.toFixed(2)}</span></span>
                    {order.deliveryPartner && (
                      <span className="text-sm text-gray-300">
                        Delivery: {order.deliveryPartner.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder && (
              <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
                <h2 className="text-xl font-bold text-csk-yellow mb-4">Order Details</h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-white">Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between mb-2 text-sm">
                      <span className="text-gray-200">{item.name} x {item.quantity}</span>
                      <span className="text-csk-yellow">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-white">Delivery Address</h3>
                  <p className="text-sm text-gray-300">
                    {selectedOrder.address.fullAddress}, {selectedOrder.address.area}, {selectedOrder.address.city} - {selectedOrder.address.pincode}
                  </p>
                </div>

                {selectedOrder.deliveryPartner && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-white">Delivery Partner</h3>
                    <p className="text-sm text-gray-300">Name: {selectedOrder.deliveryPartner.name}</p>
                    <p className="text-sm text-gray-300">Phone: {selectedOrder.deliveryPartner.phone}</p>
                  </div>
                )}

                {selectedOrder.status === 'out_for_delivery' && selectedOrder.deliveryPartner?.currentLocation && isLoaded && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-white">Live Tracking</h3>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={center}
                      zoom={15}
                    >
                      <Marker position={center} />
                    </GoogleMap>
                  </div>
                )}
                {selectedOrder.status === 'out_for_delivery' && !isLoaded && (
                  <div className="mt-4 p-4 bg-[#0f0f14] rounded-lg ring-1 ring-white/10">
                    <p className="text-sm text-gray-300">Loading map...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

