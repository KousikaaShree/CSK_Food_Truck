import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, googleLoginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await adminLogin(formData.email, formData.password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    const result = await googleLoginAdmin(credentialResponse.credential);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] py-12 px-4 text-white">
      <div className="max-w-md w-full bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-csk-yellow mb-2">
            Admin Login
          </h2>
          <p className="text-gray-300 text-sm">
            Access the admin dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm text-gray-200 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition disabled:opacity-50 font-semibold shadow-soft ring-1 ring-csk-yellow/60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            useOneTap
            theme="filled_black"
            shape="pill"
            text="signin_with"
            width="100%"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Don't have an admin account?{' '}
            <Link
              to="/admin/signup"
              className="text-csk-yellow hover:underline font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

