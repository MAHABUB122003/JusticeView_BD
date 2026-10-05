import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation(['common', 'auth']);
  const isBn = i18n.language === 'bn';

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        setError(data.errors.map(e => e.message || e.msg).join('. '));
      } else if (data?.message) {
        setError(data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(isBn ? 'লগইন ব্যর্থ হয়েছে' : 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white to-gray-100 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-justice-blue rounded-2xl mb-4 shadow-lg">
            <FiShield className="text-2xl text-justice-gold" />
          </div>
          <h1 className="text-3xl font-extrabold text-justice-blue">{t('auth:loginTitle')}</h1>
          <p className="text-dark-gray mt-2">{t('auth:loginSubtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-form p-8 border border-light-gray/60">
          {error && (
            <div className="bg-red-50 border border-red-200 text-court-red px-5 py-4 rounded-xl mb-6 text-sm flex items-start gap-2">
              <span>⚠️</span> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:email')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:password')}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-12 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-justice-gold focus:ring-justice-gold" />
                <span className="text-sm text-gray-600">{t('auth:rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-justice-gold hover:text-justice-gold-dark font-medium transition-colors">
                {t('auth:forgotPassword')}
              </Link>
            </div>

            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full">
              {t('auth:login')} <FiArrowRight />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('auth:noAccount')}{' '}
          <Link to="/register" className="text-justice-gold font-bold hover:text-justice-gold-dark transition-colors">
            {t('auth:register')} →
          </Link>
        </p>
      </div>
    </div>
  );
}
