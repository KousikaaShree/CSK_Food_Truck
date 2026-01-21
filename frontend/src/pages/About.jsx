const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-csk-yellow">
              About CSK Food Truck
            </h1>
            <p className="mt-5 text-gray-300">
              CSK Food Truck – Chicken Shawarma & Kebab is built on one simple idea: serve bold flavors with a calm,
              premium experience. From marination to grilling, we focus on quality ingredients, hygiene, and consistent
              taste—every single time.
            </p>
            <p className="mt-4 text-gray-300">
              Whether you’re craving a juicy shawarma, a smoky kebab, or a satisfying combo meal, our menu is crafted to
              feel comforting, filling, and fresh.
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="bg-[#14151a] rounded-xl shadow-soft ring-1 ring-white/10 p-5 hover:ring-csk-yellow/60 transition">
                <div className="text-sm font-semibold text-white">Fresh & Clean</div>
                <div className="mt-1 text-sm text-gray-300">Hygiene-first prep & packaging.</div>
              </div>
              <div className="bg-[#14151a] rounded-xl shadow-soft ring-1 ring-white/10 p-5 hover:ring-csk-yellow/60 transition">
                <div className="text-sm font-semibold text-white">Quality Ingredients</div>
                <div className="mt-1 text-sm text-gray-300">Premium sauces & spice blends.</div>
              </div>
              <div className="bg-[#14151a] rounded-xl shadow-soft ring-1 ring-white/10 p-5 hover:ring-csk-yellow/60 transition">
                <div className="text-sm font-semibold text-white">Made to Order</div>
                <div className="mt-1 text-sm text-gray-300">Hot, juicy, and satisfying.</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 bg-csk-yellow/15 blur-3xl rounded-[32px]" />
            <div className="relative bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=70"
                alt="Food preparation"
                className="w-full h-[360px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;


