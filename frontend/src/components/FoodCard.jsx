import { FiSettings } from 'react-icons/fi';

const FoodCard = ({ image, name, description, price, bestseller, onCustomize }) => {
  return (
    <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/5 overflow-hidden hover:shadow-lift transition transform hover:-translate-y-1 hover:ring-csk-yellow/60">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 rounded-b-[18px] ring-2 ring-transparent hover:ring-csk-yellow/70 transition" />
        <img
          src={image}
          alt={name}
          className="w-full h-44 object-cover transition duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
        {bestseller && (
          <div className="absolute top-2 right-2 bg-csk-yellow text-[#0b0b0f] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-soft">
            ⭐ Bestseller
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-white">{name}</h3>
        <p className="mt-2 text-sm text-gray-300 line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-csk-yellow">₹{price}</span>
          {onCustomize && (
            <button
              type="button"
              onClick={onCustomize}
              className="bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-full hover:bg-csk-yellowSoft transition flex items-center gap-2 shadow-soft text-sm font-semibold ring-1 ring-csk-yellow/50"
            >
              <FiSettings /> Customize
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;


