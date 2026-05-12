import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, member } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (member) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-yellow-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
            <span className="text-3xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent mb-2">
            Digital Library
          </h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl border-2 border-yellow-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white border-2 border-yellow-200 px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-yellow-200">
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors duration-200">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          By signing in, you agree to our Library Terms of Service
        </p>
      </div>
    </div>
  );
}
