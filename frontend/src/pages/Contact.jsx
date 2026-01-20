import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-4 text-csk-text">
            Have a question, feedback, or want to place a bulk order? Send us a message and we’ll get back soon.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-6">
            <h2 className="font-heading text-2xl font-semibold">Send a message</h2>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium text-csk-charcoal">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-csk-charcoal">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-csk-charcoal">Message</label>
                <textarea
                  rows="5"
                  placeholder="How can we help?"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-csk-yellow px-6 py-3 text-sm font-semibold text-csk-charcoal hover:bg-csk-yellowSoft transition shadow-soft"
              >
                Submit
              </button>
              <p className="text-xs text-csk-text">
                (UI only for now) This form does not send messages to a backend.
              </p>
            </form>
          </div>

          {/* Map + info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-csk-cream to-white flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-csk-yellow/30 ring-1 ring-csk-yellow/30">
                    <FiMapPin className="text-csk-charcoal" />
                  </div>
                  <div className="mt-3 font-medium text-csk-charcoal">Google Map Placeholder</div>
                  <div className="mt-1 text-sm text-csk-text">Add your location here when ready.</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-6">
              <h2 className="font-heading text-2xl font-semibold">Reach us</h2>
              <div className="mt-4 space-y-3 text-sm text-csk-text">
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


