import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const CustomizeModal = ({ food, isOpen, onClose, onAddToCart }) => {
  const [customizations, setCustomizations] = useState({
    extraKuboos: false,
    plateShawarma: false
  });

  if (!isOpen || !food) return null;

  const basePrice = parseFloat(food.price) || 0;
  const extraKuboosPrice = 15;
  const plateShawarmaPrice = 30;

  const calculateTotal = () => {
    let total = basePrice;
    if (customizations.extraKuboos) total += extraKuboosPrice;
    if (customizations.plateShawarma) total += plateShawarmaPrice;
    return total;
  };

  const handleToggle = (key) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAddToCart = () => {
    const finalPrice = calculateTotal();

    // Construct Add-ons Array
    const addOns = [];
    if (customizations.extraKuboos) {
      addOns.push({ name: 'Extra Kuboos', price: extraKuboosPrice });
    }
    if (customizations.plateShawarma) {
      addOns.push({ name: 'Plate Shawarma', price: plateShawarmaPrice });
    }

    const customizationData = {
      addOns,
      customizationsPrice: finalPrice - basePrice
    };

    // Pass detailed customization data
    onAddToCart(food.id || food._id, finalPrice, customizationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#14151a] border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-csk-yellow">Customize</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{food.name}</h3>
            <p className="text-sm text-gray-300">{food.description}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-[#0f0f14] rounded-xl ring-1 ring-white/10 hover:ring-csk-yellow/50 transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="extraKuboos"
                  checked={customizations.extraKuboos}
                  onChange={() => handleToggle('extraKuboos')}
                  className="w-5 h-5 rounded border-white/20 bg-[#0f0f14] text-csk-yellow focus:ring-csk-yellow/70"
                />
                <label htmlFor="extraKuboos" className="text-white cursor-pointer">
                  Extra Kuboos
                </label>
              </div>
              <span className="text-csk-yellow font-semibold">+₹{extraKuboosPrice}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0f0f14] rounded-xl ring-1 ring-white/10 hover:ring-csk-yellow/50 transition">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="plateShawarma"
                  checked={customizations.plateShawarma}
                  onChange={() => handleToggle('plateShawarma')}
                  className="w-5 h-5 rounded border-white/20 bg-[#0f0f14] text-csk-yellow focus:ring-csk-yellow/70"
                />
                <label htmlFor="plateShawarma" className="text-white cursor-pointer">
                  Plate Shawarma
                </label>
              </div>
              <span className="text-csk-yellow font-semibold">+₹{plateShawarmaPrice}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Base Price</span>
              <span className="text-white">₹{basePrice}</span>
            </div>
            {(customizations.extraKuboos || customizations.plateShawarma) && (
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-gray-400">Customizations</span>
                <span className="text-gray-300">
                  +₹{calculateTotal() - basePrice}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-xl font-bold text-csk-yellow">₹{calculateTotal()}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition font-semibold shadow-soft ring-1 ring-csk-yellow/60"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;

