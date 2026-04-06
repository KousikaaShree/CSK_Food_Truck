import { FiHeart, FiSettings } from 'react-icons/fi';

const FoodCard = ({
  image,
  name,
  description,
  price,
  tags = [],
  onCustomize,
  hasCustomization = true,
  onAddToCart,
  available = true,
  liked = false,
  onToggleLike
}) => {
  const isVeg = tags.includes('veg');
  const isNonVeg = tags.includes('nonveg');
  const isBestseller = tags.includes('bestseller');
  // Defensive: API or storage may provide "false" as a string
  const isAvailable = !(available === false || available === 'false' || available === 0 || available === '0');

  return (
    <div
      className={[
        'bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/5 overflow-hidden flex flex-col h-full max-w-sm',
        isAvailable
          ? 'hover:shadow-lift transition transform hover:-translate-y-1 hover:ring-csk-yellow/60'
          : 'opacity-60 grayscale',
      ].join(' ')}
    >
      {/* Image Section - Made taller for vertical emphasis */}
      <div className="relative overflow-hidden shrink-0">
        <div className="absolute inset-0 rounded-b-[18px] ring-2 ring-transparent hover:ring-csk-yellow/70 transition" />
        <img
          src={image}
          alt={name}
          className={`w-full h-72 object-cover transition duration-300 ${isAvailable ? 'hover:scale-[1.02]' : ''}`}
          loading="lazy"
        />
        {/* Bestseller Badge Only on Image */}
        {isBestseller && (
          <div className="absolute top-2 left-2 bg-csk-yellow text-[#0b0b0f] px-2 py-1 rounded-md text-xs font-bold leading-none shadow-soft">
            ⭐ Bestseller
          </div>
        )}

        {typeof onToggleLike === 'function' && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike();
            }}
            className={[
              'absolute top-2 right-2 h-10 w-10 rounded-full grid place-items-center ring-1 transition',
              liked
                ? 'bg-red-500/20 text-red-300 ring-red-400/30 hover:bg-red-500/30'
                : 'bg-[#0b0b0f]/45 text-gray-200 ring-white/15 hover:bg-[#0b0b0f]/60'
            ].join(' ')}
            aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
            title={liked ? 'Remove from favourites' : 'Add to favourites'}
          >
            <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          </button>
        )}

        {!isAvailable && (
          <div className="absolute top-12 right-2 bg-[#2b1818]/90 text-[#fecaca] px-2 py-1 rounded-md text-xs font-bold leading-none ring-1 ring-[#fca5a5]/40">
            Currently Unavailable
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-white leading-tight">{name}</h3>

        {/* Veg/Non-Veg Indicator */}
        <div className="mt-2 flex items-center gap-2">
          {isNonVeg && (
            <div className="flex items-center gap-1.5">
              <span className="border border-red-500 p-[1px] rounded-[2px] w-4 h-4 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-500"></div>
              </span>
              <span className="text-xs font-medium text-gray-300">Non veg</span>
            </div>
          )}
          {isVeg && (
            <div className="flex items-center gap-1.5">
              <span className="border border-green-500 p-[1px] rounded-[2px] w-4 h-4 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </span>
              <span className="text-xs font-medium text-gray-300">Veg</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-grow">
          {description}
        </p>

        {/* Price & Action */}
        <div className="mt-auto">
          {/* Price displayed prominently, or if user wants it hidden like image? The image didn't show price but usually menu needs it. 
               The user said 'give me this alignment'. The image has 'Add to cart' button at bottom.
               I'll put content like this: Price hidden or small? 
               Let's put Price above button to be safe, or inside button?
               Image has: [Add to cart <icon>]
               I'll match the 'Add to cart' button look but keep 'Customize' functionality.
           */}

          <div className="flex flex-col items-center gap-3">
            {/* Note: User image didn't show price. But hiding price is bad for UX. I will keep it but maybe subtler? 
                 Or maybe the user wants EXACT alignment. 
                 The provided image shows: Title, Veg icon, Desc, Button. Price is NOT visible in the snippet provided.
                 However, I'll be safe and put price nicely.
             */}
            {/* Price - Let's keep it left aligned or hidden? Let's keep it visible for now above button or beside it. 
                 The prompt says "without changing the theme". 
                 I'll put the button full width and red (no, keep theme yellow).
             */}

            {/* I will mimic the button style from the image: Wide, Rounded, Icon on right. */}

            {onCustomize && (
              <div className="w-full">
                {/* Price Row if needed, or just Button */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-white">₹{price}</span>
                </div>

                <button
                  type="button"
                  onClick={isAvailable ? (hasCustomization ? onCustomize : onAddToCart) : undefined}
                  disabled={!isAvailable}
                  className={[
                    'w-full py-2.5 rounded-full transition flex items-center justify-center gap-2 shadow-soft text-sm font-bold',
                    isAvailable
                      ? 'bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft'
                      : 'bg-[#18181f] text-gray-200 cursor-not-allowed ring-1 ring-white/10',
                  ].join(' ')}
                >
                  {isAvailable ? (
                    <>
                      {hasCustomization ? 'Customize ' : 'Add to cart '} <FiSettings className="w-4 h-4" />
                    </>
                  ) : (
                    'Unavailable'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;


