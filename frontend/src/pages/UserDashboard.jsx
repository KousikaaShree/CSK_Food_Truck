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
      placed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-yellow-100 text-yellow-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
            <Link
              to="/"
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition"
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
                  className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-lg">Total: ₹{order.total.toFixed(2)}</span>
                    {order.deliveryPartner && (
                      <span className="text-sm text-gray-600">
                        Delivery: {order.deliveryPartner.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.address.fullAddress}, {selectedOrder.address.area}, {selectedOrder.address.city} - {selectedOrder.address.pincode}
                  </p>
                </div>

                {selectedOrder.deliveryPartner && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Delivery Partner</h3>
                    <p className="text-sm text-gray-600">Name: {selectedOrder.deliveryPartner.name}</p>
                    <p className="text-sm text-gray-600">Phone: {selectedOrder.deliveryPartner.phone}</p>
                  </div>
                )}

                {selectedOrder.status === 'out_for_delivery' && selectedOrder.deliveryPartner?.currentLocation && isLoaded && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Live Tracking</h3>
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
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p className="text-sm text-gray-600">Loading map...</p>
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

