import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <Link
            to="/"
            className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition"
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
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {cart.items.map((item) => (
            <div
              key={item.food._id}
              className="flex items-center gap-4 py-4 border-b last:border-b-0"
            >
              <img
                src={item.food.image}
                alt={item.food.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.food.name}</h3>
                <p className="text-sm text-gray-600">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                  className="bg-pastel-pink p-2 rounded-full hover:bg-pastel-blue transition"
                >
                  <FiMinus />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                  className="bg-pastel-pink p-2 rounded-full hover:bg-pastel-blue transition"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>
                <button
                  onClick={() => removeFromCart(item.food._id)}
                  className="text-red-500 hover:text-red-700 mt-1"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t">
              <span>Total</span>
              <span className="text-primary-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

