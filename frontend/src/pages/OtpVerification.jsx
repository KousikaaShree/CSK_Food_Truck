import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp } = useAuth();
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputsRef = useRef([]);

  const email = location.state?.email || '';
  const maskedEmail = location.state?.maskedEmail || email;
  const purpose = location.state?.purpose || 'login';

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
    setMessage(`OTP sent to ${maskedEmail}`);
  }, [email, maskedEmail, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const otp = useMemo(() => otpDigits.join(''), [otpDigits]);

  const handleChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[idx] = value;
    setOtpDigits(next);
    if (value && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    const result = await verifyOtp({ email, otp, purpose });
    setLoading(false);
    if (!result.success) {
      setError(result.message || 'Invalid OTP. Please try again.');
      return;
    }

    navigate(result.role === 'admin' ? '/admin/dashboard' : '/dashboard');
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setError('');
    const result = await resendOtp({ email, purpose });
    setResending(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setMessage(`OTP resent to ${result.maskedEmail || maskedEmail}`);
    setSecondsLeft(RESEND_SECONDS);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] py-12 px-4 text-white">
      <div className="max-w-md w-full bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8">
        <h2 className="text-3xl font-bold text-center text-csk-yellow mb-2">Verify OTP</h2>
        <p className="text-center text-gray-300 text-sm mb-6">{message || `Enter the OTP sent to ${maskedEmail}`}</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6">
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                maxLength={1}
                className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-white/10 bg-[#0f0f14] text-white focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-csk-yellow text-[#0b0b0f] py-3 rounded-lg hover:bg-csk-yellowSoft transition disabled:opacity-50 font-semibold shadow-soft ring-1 ring-csk-yellow/60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-300">
          {secondsLeft > 0 ? (
            <span>Resend OTP in {secondsLeft}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-csk-yellow hover:underline disabled:opacity-60"
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

