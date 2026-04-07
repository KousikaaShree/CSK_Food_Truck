import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiFilter, FiDownload, FiCalendar, FiUser, FiSearch, FiChevronDown, FiChevronRight, FiFileText, FiX } from 'react-icons/fi';
import API_URL from '../../config';
import moment from 'moment';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grouped'
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    orderId: '',
    customerName: '',
    email: '',
    fromDate: '',
    toDate: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsError, setOrderDetailsError] = useState('');

  useEffect(() => {
    if (viewMode === 'list') {
      fetchOrders();
    } else {
      fetchGroupedOrders();
    }
  }, [viewMode, pagination.page, filters]);

  const getCleanFilters = () => {
    const clean = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        clean[key] = value.trim();
      }
    });
    return clean;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const cleanFilters = getCleanFilters();
      const res = await axios.get(`${API_URL}/api/admin/orders`, {
        params: { page: pagination.page, ...cleanFilters },
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
      });
      setOrders(res.data.orders);
      setPagination(prev => ({ 
        ...prev, 
        totalPages: res.data.totalPages, 
        totalOrders: res.data.totalOrders 
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupedOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/orders/grouped`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
      });
      setGroupedOrders(res.data);
    } catch (error) {
      console.error('Error fetching grouped orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
      });
      if (viewMode === 'list') {
        fetchOrders();
      } else {
        fetchGroupedOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const downloadOrderPDF = async (orderId) => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/orders/${orderId}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      
      // Check if response is actually a PDF
      if (res.data.type === 'application/json') {
        const text = await res.data.text();
        const error = JSON.parse(text);
        alert('Error: ' + error.message);
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading PDF. Check console for details.');
    }
  };

  const downloadBulkPDF = async () => {
    try {
      const cleanFilters = getCleanFilters();
      const res = await axios.get(`${API_URL}/api/admin/orders/export/pdf`, {
        params: cleanFilters,
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` },
        responseType: 'blob'
      });

      if (res.data.type === 'application/json') {
        const text = await res.data.text();
        const error = JSON.parse(text);
        alert('Error: ' + error.message);
        return;
      }

      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Orders_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading report');
    }
  };

  const toggleYear = (year) => setExpandedYears(v => ({ ...v, [year]: !v[year] }));
  const toggleMonth = (year, month) => setExpandedMonths(v => ({ ...v, [`${year}-${month}`]: !v[`${year}-${month}`] }));
  const toggleDay = (year, month, day) => setExpandedDays(v => ({ ...v, [`${year}-${month}-${day}`]: !v[`${year}-${month}-${day}`] }));

  const openOrderDetailsModal = async (orderMongoId) => {
    setSelectedOrderId(orderMongoId);
    setOrderDetails(null);
    setOrderDetailsError('');
    setOrderDetailsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/orders/${orderMongoId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || localStorage.getItem('token')}` }
      });
      setOrderDetails(res.data);
    } catch (error) {
      setOrderDetailsError(error.response?.data?.message || 'Failed to load order details.');
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const closeOrderDetailsModal = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
    setOrderDetailsError('');
    setOrderDetailsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <nav className="border-b border-white/5 bg-[#0d0d10]/95 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link to="/admin/dashboard" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-csk-yellow to-yellow-500 bg-clip-text text-transparent">
            Admin Panel
          </Link>
          <Link to="/admin/dashboard" className="text-sm text-gray-400 hover:text-white transition">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="main-content container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FiPackage className="text-csk-yellow" /> Orders Management
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'grouped' : 'list')}
              className="px-4 py-2 bg-[#1a1b23] border border-white/10 rounded-xl hover:bg-[#252631] transition text-sm flex items-center gap-2"
            >
              <FiCalendar /> {viewMode === 'list' ? 'Grouped View' : 'List View'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#14151a] p-6 rounded-2xl border border-white/5 shadow-xl mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FiFilter /> Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 ml-1">Order ID</label>
              <input name="orderId" placeholder="Search ID..." value={filters.orderId} onChange={handleFilterChange} className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-csk-yellow/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 ml-1">Customer Name</label>
              <input name="customerName" placeholder="Name..." value={filters.customerName} onChange={handleFilterChange} className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-csk-yellow/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 ml-1">Email</label>
              <input name="email" placeholder="Email..." value={filters.email} onChange={handleFilterChange} className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-csk-yellow/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 ml-1">From Date</label>
              <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-csk-yellow/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 ml-1">To Date</label>
              <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-csk-yellow/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 ml-1">Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-[#0f0f14] border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-csk-yellow/50 outline-none text-gray-300">
                <option value="">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-csk-yellow"></div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            <div className="bg-[#14151a] rounded-2xl border border-white/5 overflow-x-auto">
               <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-[#1a1b23] text-gray-400 text-xs uppercase">
                    <tr>
                       <th className="px-6 py-4">Order ID</th>
                       <th className="px-6 py-4">Customer</th>
                       <th className="px-6 py-4">Total</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-white/[0.02] transition group">
                        <td className="px-6 py-4 font-mono text-csk-yellow text-sm">
                          <button
                            type="button"
                            onClick={() => openOrderDetailsModal(order._id)}
                            className="hover:underline underline-offset-4"
                            title="View order details"
                          >
                            {order.orderId}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                           <div className="text-sm font-medium">{order.address?.name || order.user?.name}</div>
                           <div className="text-xs text-gray-500">{order.address?.email || order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                           <select 
                             value={order.status}
                             onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                             className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer outline-none bg-[#14151a] border border-white/10 ${
                               order.status === 'delivered' ? 'text-green-500' :
                               order.status === 'cancelled' ? 'text-red-500' :
                               'text-csk-yellow'
                             }`}
                           >
                             <option value="placed">Placed</option>
                             <option value="preparing">Preparing</option>
                             <option value="out_for_delivery">Out for Delivery</option>
                             <option value="delivered">Delivered</option>
                             <option value="cancelled">Cancelled</option>
                           </select>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}</td>
                        <td className="px-6 py-4">
                           <button 
                             onClick={() => downloadOrderPDF(order._id)}
                             className="p-2 bg-[#1a1b23] rounded-lg hover:bg-csk-yellow hover:text-[#0b0b0f] transition group"
                             title="Download PDF"
                           >
                             <FiFileText size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
               <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Showing {orders.length} of {pagination.totalOrders} orders</p>
               <div className="flex gap-2">
                  <button 
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                    className="px-4 py-2 bg-[#14151a] rounded-xl border border-white/5 disabled:opacity-50 hover:bg-[#1a1b23] transition"
                  >Prev</button>
                  <button 
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                    className="px-4 py-2 bg-[#14151a] rounded-xl border border-white/5 disabled:opacity-50 hover:bg-[#1a1b23] transition"
                  >Next</button>
               </div>
            </div>
          </div>
        ) : (
          /* Grouped View */
          <div className="space-y-4">
            {Object.entries(groupedOrders).map(([year, months]) => (
              <div key={year} className="bg-[#14151a] rounded-2xl border border-white/5 overflow-hidden">
                <button 
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-[#1a1b23] hover:bg-[#20212b] transition"
                >
                  <span className="text-xl font-bold flex items-center gap-2"><FiCalendar className="text-csk-yellow"/> {year}</span>
                  {expandedYears[year] ? <FiChevronDown /> : <FiChevronRight />}
                </button>
                
                {expandedYears[year] && (
                  <div className="p-4 space-y-3">
                    {Object.entries(months).map(([month, days]) => (
                      <div key={month} className="border border-white/5 rounded-xl overflow-hidden">
                        <button 
                          onClick={() => toggleMonth(year, month)}
                          className="w-full flex items-center justify-between px-5 py-3 bg-[#171821] hover:bg-[#1f202b] transition"
                        >
                          <span className="font-semibold">{month}</span>
                          {expandedMonths[`${year}-${month}`] ? <FiChevronDown /> : <FiChevronRight />}
                        </button>
                        
                        {expandedMonths[`${year}-${month}`] && (
                          <div className="p-3 space-y-2">
                             {Object.entries(days).map(([day, dayOrders]) => (
                               <div key={day} className="border border-white/5 rounded-lg overflow-hidden">
                                  <button 
                                    onClick={() => toggleDay(year, month, day)}
                                    className="w-full flex items-center justify-between px-4 py-2 bg-[#1c1d29] hover:bg-[#252636] transition"
                                  >
                                    <span className="text-sm font-medium">Day {day} ({dayOrders.length} orders)</span>
                                    {expandedDays[`${year}-${month}-${day}`] ? <FiChevronDown /> : <FiChevronRight />}
                                  </button>
                                  
                                  {expandedDays[`${year}-${month}-${day}`] && (
                                    <div className="p-3 bg-[#0f0f14]/50">
                                       <div className="space-y-2">
                                          {dayOrders.map(order => (
                                            <div key={order._id} className="flex justify-between items-center p-3 bg-white/[0.03] rounded-lg hover:bg-white/[0.05] transition group">
                                               <div>
                                                  <button
                                                    type="button"
                                                    onClick={() => openOrderDetailsModal(order._id)}
                                                    className="text-sm font-bold text-white group-hover:text-csk-yellow transition hover:underline underline-offset-4"
                                                    title="View order details"
                                                  >
                                                    {order.orderId}
                                                  </button>
                                                  <div className="text-xs text-gray-500">{order.address?.name || order.user?.name} • ₹{order.total.toFixed(2)}</div>
                                               </div>
                                               <button 
                                                 onClick={() => downloadOrderPDF(order._id)}
                                                 className="p-2 hover:text-csk-yellow transition"
                                               >
                                                 <FiDownload />
                                               </button>
                                            </div>
                                          ))}
                                       </div>
                                    </div>
                                  )}
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrderId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] p-4 flex items-center justify-center"
          onClick={closeOrderDetailsModal}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#14151a] border border-white/10 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#14151a] border-b border-white/10 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-csk-yellow">Order Details</h3>
              <button
                type="button"
                onClick={closeOrderDetailsModal}
                className="p-2 rounded-lg hover:bg-white/5 transition"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {orderDetailsLoading && (
                <div className="text-sm text-gray-300">Loading order details...</div>
              )}

              {orderDetailsError && (
                <div className="text-sm text-red-400">{orderDetailsError}</div>
              )}

              {!orderDetailsLoading && !orderDetailsError && orderDetails && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-[#0f0f14] rounded-xl p-4 border border-white/5">
                      <h4 className="font-semibold mb-2 text-gray-200">Customer Details</h4>
                      <p className="text-sm text-gray-300">Name: {orderDetails.address?.name || orderDetails.user?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-300">Phone: {orderDetails.address?.mobile || orderDetails.user?.mobile || 'N/A'}</p>
                      <p className="text-sm text-gray-300">Address: {[orderDetails.address?.fullAddress, orderDetails.address?.area, orderDetails.address?.city, orderDetails.address?.pincode].filter(Boolean).join(', ') || 'N/A'}</p>
                    </div>

                    <div className="bg-[#0f0f14] rounded-xl p-4 border border-white/5">
                      <h4 className="font-semibold mb-2 text-gray-200">Order Details</h4>
                      <p className="text-sm text-gray-300">Order ID: {orderDetails.orderId}</p>
                      <p className="text-sm text-gray-300">Date & Time: {moment(orderDetails.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
                      <p className="text-sm text-gray-300">Payment: {(orderDetails.paymentMethod || 'N/A').toUpperCase()}</p>
                      <p className="text-sm text-gray-300">Total: ₹{Number(orderDetails.total || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="bg-[#0f0f14] rounded-xl p-4 border border-white/5">
                    <h4 className="font-semibold mb-3 text-gray-200">Menu Items</h4>
                    <div className="space-y-3">
                      {(orderDetails.items || []).map((item, idx) => {
                        const addOns = item?.customizationData?.addOns || [];
                        const hasCustomization = addOns.length > 0;
                        return (
                          <div key={idx} className="rounded-xl border border-white/10 p-3 bg-white/[0.02]">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                              <div className="text-gray-100 font-medium">{item.name || item.food?.name || 'Item'}</div>
                              <div className="text-gray-300 md:text-right">Qty: {Number(item.quantity || 0)}</div>
                              <div className="text-gray-300 md:text-right">Price: ₹{Number(item.price || 0).toFixed(2)}</div>
                              <div className="text-gray-100 md:text-right font-semibold">
                                Subtotal: ₹{(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}
                              </div>
                            </div>

                            <div className="mt-2 pl-2 border-l-2 border-csk-yellow/40">
                              <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Customization</p>
                              {hasCustomization ? (
                                <ul className="space-y-1">
                                  {addOns.map((addon, addonIdx) => (
                                    <li key={addonIdx} className="text-xs text-gray-300">
                                      - {addon.name} {Number(addon.price || 0) > 0 ? `(₹${Number(addon.price || 0).toFixed(2)})` : ''}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs text-gray-500">No customization</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-[#0f0f14] rounded-xl p-4 border border-white/5">
                    <h4 className="font-semibold mb-2 text-gray-200">Delivery Details</h4>
                    <p className="text-sm text-gray-300">
                      Distance: {Number.isFinite(Number(orderDetails.deliveryDistanceKm))
                        ? `${Number(orderDetails.deliveryDistanceKm).toFixed(2)} km`
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-300 font-semibold">Delivery Charge: ₹{Number(orderDetails.deliveryFee || 0).toFixed(2)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;


