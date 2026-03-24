import { useState } from 'react';
import axios from 'axios';
import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import API_URL from '../config';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await axios.post(`${API_URL}/api/contact/send`, formData);
      setStatus({ type: 'success', message: res.data.message });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send message. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

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
            
            {status.message && (
              <div className={`mt-4 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'}`}>
                {status.message}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-gray-200">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60 text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-200">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="How can we help?"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60 text-white placeholder:text-gray-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-csk-yellow px-6 py-3 text-sm font-semibold text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>

          {/* Map + info */}
          <div className="space-y-6">
            <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.6202476054!2d77.4764!3d10.0104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDAwJzM3LjQiTiA3N8KwMjgnMzUuMCJF!5e0!3m2!1sen!2sin!4v1711030000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CSK Food Truck Location"
              ></iframe>
            </div>

            <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
              <h2 className="font-heading text-2xl font-semibold text-white">Reach us</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <a href="tel:+917402065058" className="flex items-center gap-3 hover:text-csk-yellow transition">
                  <FiPhone /> <span>+91 74020 65058</span>
                </a>
                <a href="mailto:csktrucktheni@gmail.com" className="flex items-center gap-3 hover:text-csk-yellow transition">
                  <FiMail /> <span>csktrucktheni@gmail.com</span>
                </a>
                <a href="https://www.instagram.com/csktruck_theni" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-csk-yellow transition">
                  <FiInstagram /> <span>@csktruck_theni</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;


