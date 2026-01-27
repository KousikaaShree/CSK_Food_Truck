import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-csk-yellow"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white p-4">
        <div className="bg-[#14151a] rounded-3xl shadow-soft ring-1 ring-white/10 p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-[#1e1f26] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
            <FiShoppingBag size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center w-full rounded-xl px-6 py-3.5 font-bold bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition transform hover:scale-[1.02] shadow-soft"
          >
            Start Ordering <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.total || 0;
  // const tax = subtotal * 0.18; // Assuming tax might be inclusive or exclusive. Let's keep it simple or strictly follow request. Request said "18% GST".
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-heading font-bold text-csk-yellow mb-8 flex items-center gap-3">
          <FiShoppingBag /> Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item, idx) => {
              // Ensure we have a valid key. If cartItemId exists (from new context), use it. otherwise fallback.
              const itemKey = item.cartItemId || `${item.food.id}-${idx}`;

              return (
                <div
                  key={itemKey}
                  className="bg-[#14151a] rounded-2xl p-5 shadow-soft ring-1 ring-white/5 flex flex-col sm:flex-row gap-5"
                >
                  {/* Item Image */}
                  <div className="shrink-0">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-full sm:w-32 sm:h-32 object-cover rounded-xl shadow-md"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{item.food.name}</h3>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.food.tags?.includes('nonveg') && (
                            <div className="flex items-center gap-1">
                              <span className="border border-red-500 p-[2px] rounded-[2px] w-3.5 h-3.5 flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-500"></div>
                              </span>
                              <span className="text-xs text-gray-400">Non-Veg</span>
                            </div>
                          )}
                          {item.food.tags?.includes('veg') && (
                            <div className="flex items-center gap-1">
                              <span className="border border-green-500 p-[2px] rounded-[2px] w-3.5 h-3.5 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                              </span>
                              <span className="text-xs text-gray-400">Veg</span>
                            </div>
                          )}
                          {item.food.tags?.includes('bestseller') && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-csk-yellow text-black">
                              ⭐ Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="mt-3 bg-[#0f0f14] rounded-lg p-3 text-sm text-gray-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Base Price</span>
                        <span>₹{item.basePrice}</span>
                      </div>
                      {item.customizationData?.addOns?.map((addon, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-gray-400">+ {addon.name}</span>
                          <span>₹{addon.price}</span>
                        </div>
                      ))}
                    </div>

                    {/* Controls & Total Row */}
                    <div className="mt-auto pt-4 flex flex-wrap items-end justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[#0f0f14] rounded-lg p-1 ring-1 ring-white/10">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded transition"
                          disabled={loading}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded transition"
                          disabled={loading}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">Item Total</span>
                        <span className="text-xl font-bold text-csk-yellow">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button (Absolute or separate) */}
                  <div className="absolute top-4 right-4 sm:static sm:top-auto sm:right-auto">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-500 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-full"
                      title="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#14151a] rounded-2xl p-6 shadow-soft ring-1 ring-white/5 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (18% GST)</span>
                  <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-gray-300 font-medium">Total Amount</span>
                <span className="text-3xl font-bold text-csk-yellow">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-csk-yellow text-[#0b0b0f] py-4 rounded-xl font-bold text-lg hover:bg-csk-yellowSoft transition transform hover:scale-[1.02] shadow-lift"
              >
                Proceed to Checkout
              </button>

              <p className="mt-4 text-xs text-center text-gray-500">
                Secure checkout powered by CSK Food Truck
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

