import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-csk-yellow">Contact Us</h1>
          <p className="mt-4 text-gray-300">
            Have a question, feedback, or want to place a bulk order? Send us a message and we’ll get back soon.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="font-heading text-2xl font-semibold text-white">Send a message</h2>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium text-gray-200">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Message</label>
                <textarea
                  rows="5"
                  placeholder="How can we help?"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60 text-white placeholder:text-gray-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-csk-yellow px-6 py-3 text-sm font-semibold text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60"
              >
                Submit
              </button>
              <p className="text-xs text-gray-400">
                (UI only for now) This form does not send messages to a backend.
              </p>
            </form>
          </div>

          {/* Map + info */}
          <div className="space-y-6">
            <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-[#0f0f14] to-[#15151d] flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-csk-yellow/25 ring-1 ring-csk-yellow/40">
                    <FiMapPin className="text-csk-yellow" />
                  </div>
                  <div className="mt-3 font-medium text-white">Google Map Placeholder</div>
                  <div className="mt-1 text-sm text-gray-400">Add your location here when ready.</div>
                </div>
              </div>
            </div>

            <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
              <h2 className="font-heading text-2xl font-semibold text-white">Reach us</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <FiPhone /> <span>+91 XXXXX XXXXX</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail /> <span>hello@cskfoodtruck.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiInstagram /> <span>@cskfoodtruck</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;


