import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiPhone, FiSave, FiShield } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Profile() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['common', 'auth']);
  const isBn = i18n.language === 'bn';
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authService.updateProfile(form);
      setMessage(isBn ? 'প্রোফাইল আপডেট হয়েছে' : 'Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-justice-blue mb-8">{t('nav.profile')}</h1>

        <div className="grid gap-8">
          {/* User Info Card */}
          <Card>
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-light-gray/60">
              <div className="w-20 h-20 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-justice-gold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-justice-blue">{user?.name}</h2>
                <p className="text-dark-gray text-sm">{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-justice-blue/5 text-justice-blue border border-justice-blue/20">
                  <FiShield /> {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>

            {message && <div className="bg-green-50 border border-green-200 text-success-green px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2">✓ {message}</div>}
            {error && <div className="bg-red-50 border border-red-200 text-court-red px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2">⚠ {error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:email')}</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-4 text-gray-400" />
                  <input value={user?.email || ''} disabled className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl bg-gray-50 text-gray-500 text-sm cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:name')}</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-4 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth:phone')}</label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-4 text-gray-400" />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
              <Button type="submit" loading={loading} variant="gold" icon={<FiSave />}>{t('common.update')}</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
