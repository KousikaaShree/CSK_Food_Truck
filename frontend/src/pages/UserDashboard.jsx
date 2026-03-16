import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiHeart, FiMapPin, FiPackage, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';

const UserDashboard = () => {
  const { user: authUser } = useAuth();
  const { addToCart } = useCart();
  const { items: menuItems } = useMenu();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('orders'); // orders | favourites | addresses

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: '', mobile: '' });

  const [favourites, setFavourites] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState({
    label: 'Home',
    fullAddress: '',
    city: '',
    area: '',
    pincode: '',
    mobile: ''
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    fetchOrdersAndProfile();
  }, []);

  const authHeaders = useMemo(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  const fetchOrdersAndProfile = async () => {
    try {
      const [ordersRes, profileRes] = await Promise.all([
        axios.get('/api/orders/my-orders', authHeaders),
        axios.get('/api/user/me', authHeaders)
      ]);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);

      const p = profileRes.data?.user || null;
      setProfile(p);
      setFavourites(Array.isArray(p?.favourites) ? p.favourites : []);
      setAddresses(Array.isArray(p?.addresses) ? p.addresses : []);

      setProfileDraft({
        name: p?.name || authUser?.name || '',
        mobile: p?.mobile || authUser?.mobile || ''
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
      setProfileError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setProfileLoading(false);
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

  const currentOrders = useMemo(() => (
    orders.filter(o => o && o.status && o.status !== 'delivered' && o.status !== 'cancelled')
  ), [orders]);

  const completedOrders = useMemo(() => (
    orders.filter(o => o && (o.status === 'delivered'))
  ), [orders]);

  const formatDateTime = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return '';
    }
  };

  const extractFoodId = (orderItem) => {
    const f = orderItem?.food;
    if (!f) return null;
    if (typeof f === 'string') return f;
    return f._id || f.id || null;
  };

  const handleReorder = async (order) => {
    if (!order?.items?.length) return;

    for (const item of order.items) {
      const foodId = extractFoodId(item);
      const addOns = item.customizationData?.addOns || [];
      const qty = Number(item.quantity) || 1;

      // Fall back by name if item.food is missing (older orders)
      const resolvedFoodId = foodId || (menuItems.find(m => m.name === item.name)?.id || menuItems.find(m => m.name === item.name)?._id);
      if (!resolvedFoodId) continue;

      // Add to cart supports addOns via customizationData
      await addToCart(resolvedFoodId, qty, { addOns });
    }

    navigate('/checkout');
  };

  const saveProfile = async () => {
    try {
      const res = await axios.put('/api/user/me', profileDraft, authHeaders);
      const updated = res.data?.user || null;
      if (updated) {
        setProfile(updated);
        setEditingProfile(false);
      }
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const openNewAddress = () => {
    setEditingAddressId(null);
    setAddressDraft({
      label: 'Home',
      fullAddress: '',
      city: '',
      area: '',
      pincode: '',
      mobile: profile?.mobile || authUser?.mobile || ''
    });
    setAddressFormOpen(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr?._id || addr?.id || null);
    setAddressDraft({
      label: addr?.label || 'Home',
      fullAddress: addr?.fullAddress || '',
      city: addr?.city || '',
      area: addr?.area || '',
      pincode: addr?.pincode || '',
      mobile: addr?.mobile || profile?.mobile || authUser?.mobile || ''
    });
    setAddressFormOpen(true);
  };

  const saveAddress = async () => {
    try {
      if (editingAddressId) {
        const res = await axios.put(`/api/user/addresses/${editingAddressId}`, addressDraft, authHeaders);
        setAddresses(res.data?.addresses || []);
      } else {
        const res = await axios.post('/api/user/addresses', addressDraft, authHeaders);
        setAddresses(res.data?.addresses || []);
      }
      setAddressFormOpen(false);
      setEditingAddressId(null);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to save address');
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await axios.delete(`/api/user/addresses/${addressId}`, authHeaders);
      setAddresses(res.data?.addresses || []);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const removeFavourite = async (foodId) => {
    try {
      const res = await axios.delete(`/api/user/favourites/${foodId}`, authHeaders);
      setFavourites(res.data?.favourites || []);
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update favourites');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Profile header card */}
        <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-gray-400">Profile</div>
            <div className="text-2xl font-bold text-white">{profile?.name || authUser?.name || 'User'}</div>
            <div className="mt-2 text-sm text-gray-300">{profile?.email || authUser?.email}</div>
            <div className="text-sm text-gray-300">{profile?.mobile || authUser?.mobile || 'Phone not provided'}</div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProfile(true);
              setProfileError('');
            }}
            className="inline-flex items-center gap-2 bg-[#18181f] hover:bg-[#23232c] transition text-gray-100 px-4 py-2 rounded-xl ring-1 ring-white/10"
            disabled={profileLoading}
          >
            <FiEdit2 /> Edit Profile
          </button>
        </div>

        {profileError && (
          <div className="bg-[#2b1818] border border-[#fca5a5] text-[#fecaca] px-4 py-3 rounded">
            {profileError}
          </div>
        )}

        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-3 h-fit">
            <button
              type="button"
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeSection === 'orders' ? 'bg-csk-yellow text-[#0b0b0f]' : 'text-gray-200 hover:bg-white/5'}`}
            >
              <FiPackage /> My Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('favourites')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeSection === 'favourites' ? 'bg-csk-yellow text-[#0b0b0f]' : 'text-gray-200 hover:bg-white/5'}`}
            >
              <FiHeart /> Favourites
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeSection === 'addresses' ? 'bg-csk-yellow text-[#0b0b0f]' : 'text-gray-200 hover:bg-white/5'}`}
            >
              <FiMapPin /> Addresses
            </button>
          </aside>

          {/* Main */}
          <main className="space-y-6">
            {/* ORDERS */}
            {activeSection === 'orders' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-csk-yellow mb-4">Current Orders</h2>
                  {currentOrders.length === 0 ? (
                    <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 text-gray-300">
                      No current orders.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentOrders.map((order) => (
                        <div key={order._id} className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-white">CSK Food Truck</div>
                              <div className="text-sm text-gray-400">Order #{order.orderId}</div>
                              <div className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {String(order.status || '').replace('_', ' ').toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between gap-4 text-sm">
                                <div className="text-gray-200">
                                  <div className="font-semibold">{it.name} <span className="text-gray-400">× {it.quantity}</span></div>
                                  {it.customizationData?.addOns?.length > 0 && (
                                    <div className="text-xs text-gray-400">
                                      Add-ons: {it.customizationData.addOns.map(a => a.name).join(', ')}
                                    </div>
                                  )}
                                </div>
                                <div className="text-csk-yellow font-semibold">
                                  ₹{(Number(it.price || 0) * Number(it.quantity || 0)).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                            <div className="text-gray-200 font-bold">
                              Total: <span className="text-csk-yellow">₹{Number(order.total || 0).toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {order.address?.area ? `${order.address.area}, ` : ''}{order.address?.city || ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-csk-yellow mb-4">Completed Orders</h2>
                  {completedOrders.length === 0 ? (
                    <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 text-gray-300">
                      No completed orders yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedOrders.map((order) => (
                        <div key={order._id} className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-white">CSK Food Truck</div>
                              <div className="text-sm text-gray-400">Order #{order.orderId}</div>
                              <div className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-500/15 text-green-300">
                              DELIVERED
                            </span>
                          </div>

                          <div className="mt-4 grid sm:grid-cols-2 gap-3">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="bg-[#0f0f14] rounded-xl ring-1 ring-white/10 p-4 flex gap-3">
                                <div className="h-12 w-12 rounded-lg bg-white/5 overflow-hidden shrink-0">
                                  {it.food?.image && (
                                    <img src={it.food.image} alt={it.name} className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-gray-100">{it.name}</div>
                                  {it.customizationData?.addOns?.length > 0 && (
                                    <div className="text-xs text-gray-400">
                                      Add-ons: {it.customizationData.addOns.map(a => a.name).join(', ')}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-400 mt-1">Qty: {it.quantity}</div>
                                </div>
                                <div className="text-sm font-bold text-csk-yellow">
                                  ₹{(Number(it.price || 0) * Number(it.quantity || 0)).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                            <div className="text-gray-200 font-bold">
                              Total: <span className="text-csk-yellow">₹{Number(order.total || 0).toFixed(2)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleReorder(order)}
                              className="bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-xl hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
                            >
                              Reorder
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FAVOURITES */}
            {activeSection === 'favourites' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-csk-yellow">Favourites</h2>

                {favourites.length === 0 ? (
                  <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 text-gray-300">
                    No favourites yet.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favourites.map((f) => (
                      <div key={f._id} className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 overflow-hidden">
                        <div className="h-40 bg-white/5">
                          {f.image && <img src={f.image} alt={f.name} className="h-full w-full object-cover" />}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white">{f.name}</div>
                              <div className="text-sm text-gray-400 line-clamp-2">{f.description}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFavourite(f._id)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                              aria-label="Remove from favourites"
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-csk-yellow font-bold">₹{Number(f.price || 0)}</div>
                            <button
                              type="button"
                              onClick={() => addToCart(f._id, 1, { addOns: [] })}
                              disabled={f.available === false || f.available === 'false'}
                              className="bg-csk-yellow text-[#0b0b0f] px-3 py-2 rounded-xl hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {activeSection === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-csk-yellow">Addresses</h2>
                  <button
                    type="button"
                    onClick={openNewAddress}
                    className="bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-xl hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
                  >
                    Add Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 text-gray-300">
                    No saved addresses yet.
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((a) => (
                      <div key={a._id} className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold text-white">{a.label || 'Home'}</div>
                            <div className="mt-1 text-sm text-gray-300">
                              {a.fullAddress}{a.area ? `, ${a.area}` : ''}{a.city ? `, ${a.city}` : ''}{a.pincode ? ` - ${a.pincode}` : ''}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditAddress(a)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                              aria-label="Edit address"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAddress(a._id)}
                              className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                              aria-label="Delete address"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {addressFormOpen && (
                  <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
                    <div className="font-bold text-white mb-4">{editingAddressId ? 'Edit Address' : 'New Address'}</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Label</label>
                        <select
                          value={addressDraft.label}
                          onChange={(e) => setAddressDraft(d => ({ ...d, label: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                        >
                          <option>Home</option>
                          <option>Work</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Mobile</label>
                        <input
                          value={addressDraft.mobile}
                          onChange={(e) => setAddressDraft(d => ({ ...d, mobile: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-300 mb-1">Full address</label>
                        <textarea
                          rows={3}
                          value={addressDraft.fullAddress}
                          onChange={(e) => setAddressDraft(d => ({ ...d, fullAddress: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">City</label>
                        <input
                          value={addressDraft.city}
                          onChange={(e) => setAddressDraft(d => ({ ...d, city: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Area</label>
                        <input
                          value={addressDraft.area}
                          onChange={(e) => setAddressDraft(d => ({ ...d, area: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Pincode</label>
                        <input
                          value={addressDraft.pincode}
                          onChange={(e) => setAddressDraft(d => ({ ...d, pincode: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={saveAddress}
                        className="bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-xl hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressFormOpen(false);
                          setEditingAddressId(null);
                        }}
                        className="bg-[#18181f] hover:bg-[#23232c] transition text-gray-100 px-4 py-2 rounded-xl ring-1 ring-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit profile modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-csk-yellow">Edit Profile</div>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="text-gray-300 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input
                  value={profileDraft.name}
                  onChange={(e) => setProfileDraft(d => ({ ...d, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Phone</label>
                <input
                  value={profileDraft.mobile}
                  onChange={(e) => setProfileDraft(d => ({ ...d, mobile: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] ring-1 ring-white/10"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={saveProfile}
                className="bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-xl hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="bg-[#18181f] hover:bg-[#23232c] transition text-gray-100 px-4 py-2 rounded-xl ring-1 ring-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

