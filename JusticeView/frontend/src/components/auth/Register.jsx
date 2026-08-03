import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiLock, FiArrowRight, FiShield, FiPhone, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const roles = [
  { value: 'public_user', label_en: 'General User', label_bn: 'সাধারণ ব্যবহারকারী' },
  { value: 'police_officer', label_en: 'Police Officer', label_bn: 'পুলিশ অফিসার' },
  { value: 'court_clerk', label_en: 'Court Clerk', label_bn: 'কোর্ট ক্লার্ক' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'public_user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['common', 'auth']);
  const isBn = i18n.language === 'bn';

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        setError(data.errors.map(e => e.message || e.msg).join('. '));
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError(isBn ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed');
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
          <h1 className="text-3xl font-extrabold text-justice-blue">{t('auth:registerTitle')}</h1>
          <p className="text-dark-gray mt-2">{t('auth:registerSubtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-form p-8 border border-light-gray/60">
          {error && (
            <div className="bg-red-50 border border-red-200 text-court-red px-5 py-4 rounded-xl mb-6 text-sm flex items-start gap-2">
              <span>⚠️</span> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:name')}</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-4 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder={isBn ? 'আপনার নাম' : 'Your name'}
                  className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:email')}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:password')}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-4 text-gray-400" />
                  <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="••••••••"
                    className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:phone')}</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-4 text-gray-400" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+880"
                    className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
              <FiInfo className="mt-0.5 flex-shrink-0" />
              <span>{isBn ? 'পাসওয়ার্ডে কমপক্ষে ৬টি অক্ষর, একটি ছোট হাতের অক্ষর ও একটি সংখ্যা থাকতে হবে' : 'Password must be at least 6 characters, include a lowercase letter and a number'}</span>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:role')}</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white appearance-none cursor-pointer">
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>{isBn ? r.label_bn : r.label_en}</option>
                ))}
              </select>
            </div>

            <Button type="submit" loading={loading} variant="gold" size="lg" className="w-full">
              {t('auth:register')} <FiArrowRight />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('auth:hasAccount')}{' '}
          <Link to="/login" className="text-justice-gold font-bold hover:text-justice-gold-dark transition-colors">
            {t('auth:login')} →
          </Link>
        </p>
      </div>
    </div>
  );
}
