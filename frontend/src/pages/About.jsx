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
              CSK™ was Conceptualized in 2015 by 3 engineers from CIT, Coimbatore. The name was inspired by the IPL team CSK (Chennai Super Kings). Being fans of cricket and food lovers, we established our first fan-based outlet in the name of CSK (chats, shakes & kulfi) at Coimbatore in 2016.
            </p>
            <p className="mt-4 text-gray-300">
              From thereon we have served various mouth watering recipes with quality and at affordable price to the customers across the city. The menu and the concept of the restaurant have been carefully customized to provide better taste, quality and good ambience to the customers.
            </p>
            <p className="mt-4 text-gray-300">
              We have ensured CSK is not just a place to dine rather it’s a place to hangout. Over the years it has become a prime hotspot for college students. Moreover our signature menu and concepts have made our reach very easy to the customers and has encouraged us to establish in many cities.
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


