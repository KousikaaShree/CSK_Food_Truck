import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">Loading...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
        <div className="text-center bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 px-8 py-10">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.total || 0;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-csk-yellow mb-8">Shopping Cart</h1>

        <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6 mb-6">
          {cart.items.map((item) => (
            <div
              key={item.food._id}
              className="flex items-center gap-4 py-4 border-b border-white/5 last:border-b-0"
            >
              <img
                src={item.food.image}
                alt={item.food.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.food.name}</h3>
                <p className="text-sm text-gray-400">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                  className="bg-[#18181f] text-csk-yellow p-2 rounded-full hover:bg-[#27272f] transition"
                >
                  <FiMinus />
                </button>
                <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                  className="bg-[#18181f] text-csk-yellow p-2 rounded-full hover:bg-[#27272f] transition"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold text-csk-yellow">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item.food._id)}
                  className="text-gray-400 hover:text-csk-yellow mt-1 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
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
            <div className="flex justify-between text-xl font-bold pt-4 border-t">
              <span>Total</span>
              <span className="text-csk-yellow">₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

