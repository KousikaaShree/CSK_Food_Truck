import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const res = await axios.get('/api/admin/delivery', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setDeliveryPartners(res.data);
    } catch (error) {
      console.error('Error fetching delivery partners:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      fetchOrders();
    } catch (error) {
      alert('Error updating order status');
      console.error(error);
    }
  };

  const assignDeliveryPartner = async (orderId, deliveryPartnerId) => {
    try {
      await axios.put(
        `/api/admin/orders/${orderId}/assign-delivery`,
        { deliveryPartnerId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      );
      fetchOrders();
    } catch (error) {
      alert('Error assigning delivery partner');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-csk-yellow/15 text-csk-yellow',
      preparing: 'bg-csk-yellow/25 text-csk-yellow',
      out_for_delivery: 'bg-csk-yellow/25 text-csk-yellow',
      delivered: 'bg-[#18181f] text-gray-100',
      cancelled: 'bg-[#18181f] text-gray-400'
    };
    return colors[status] || 'bg-[#18181f] text-gray-200';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <nav className="bg-gradient-to-r from-[#0d0d10]/95 via-[#111118]/95 to-[#0b0b0f]/95 shadow-soft backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="text-2xl font-bold text-white">
              Admin Panel
            </Link>
            <Link to="/admin/dashboard" className="text-gray-100/85 hover:text-csk-yellow">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-csk-yellow mb-8">Order Management</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 cursor-pointer hover:shadow-lift transition"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-400">
                      {order.user?.name} - {order.user?.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400">
                    Payment: {order.paymentMethod.toUpperCase()} - {order.paymentStatus}
                  </p>
                  <p className="text-lg font-bold text-csk-yellow">Total: ₹{order.total.toFixed(2)}</p>
                </div>

                <div className="flex gap-2">
                  {order.status === 'placed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order._id, 'preparing');
                      }}
                      className="flex-1 bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-lg hover:bg-csk-yellowSoft transition font-semibold ring-1 ring-csk-yellow/60"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order._id, 'out_for_delivery');
                      }}
                      className="flex-1 bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-lg hover:bg-csk-yellowSoft transition font-semibold ring-1 ring-csk-yellow/60"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOrderStatus(order._id, 'delivered');
                      }}
                      className="flex-1 bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-lg hover:bg-csk-yellowSoft transition font-semibold ring-1 ring-csk-yellow/60"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
              <h2 className="text-xl font-bold text-csk-yellow mb-4">Order Details</h2>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">Customer Info</h3>
                <p className="text-sm text-gray-400">Name: {selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-400">Email: {selectedOrder.user?.email}</p>
                <p className="text-sm text-gray-400">Mobile: {selectedOrder.user?.mobile}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">Items</h3>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="text-gray-200">{item.name} x {item.quantity}</span>
                    <span className="text-csk-yellow">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">Delivery Address</h3>
                <p className="text-sm text-gray-400">
                  {selectedOrder.address.fullAddress}, {selectedOrder.address.area}, {selectedOrder.address.city} - {selectedOrder.address.pincode}
                </p>
                <p className="text-sm text-gray-400">Mobile: {selectedOrder.address.mobile}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-white">Update Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                  className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                >
                  <option value="placed">Placed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {!selectedOrder.deliveryPartner && selectedOrder.status === 'preparing' && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-white">Assign Delivery Partner</h3>
                  <select
                    onChange={(e) => assignDeliveryPartner(selectedOrder._id, e.target.value)}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  >
                    <option value="">Select Delivery Partner</option>
                    {deliveryPartners.map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name} - {partner.phone}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedOrder.deliveryPartner && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 text-white">Delivery Partner</h3>
                  <p className="text-sm text-gray-400">Name: {selectedOrder.deliveryPartner.name}</p>
                  <p className="text-sm text-gray-400">Phone: {selectedOrder.deliveryPartner.phone}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

