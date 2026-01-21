import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(
      formData.name,
      formData.email,
      formData.mobile,
      formData.password
    );
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] py-12 px-4 text-white">
      <div className="max-w-md w-full bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8">
        <h2 className="text-3xl font-bold text-center text-csk-yellow mb-6">
          Sign Up
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-200 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition disabled:opacity-50 font-semibold shadow-soft ring-1 ring-csk-yellow/60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-csk-yellow hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

