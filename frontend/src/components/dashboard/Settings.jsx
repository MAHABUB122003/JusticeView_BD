import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiLock, FiSave, FiShield } from 'react-icons/fi';
import { authService } from '../../services/authService';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Settings() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (form.newPassword !== form.confirmPassword) {
      setError(isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMessage(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে' : 'Password changed successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-justice-blue mb-8">{t('nav.settings')}</h1>

        <Card>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-light-gray/60">
            <div className="w-12 h-12 bg-justice-blue/5 rounded-xl flex items-center justify-center text-justice-blue">
              <FiLock className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-justice-blue">{isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</h2>
              <p className="text-sm text-dark-gray">{isBn ? 'আপনার পাসওয়ার্ড নিয়মিত পরিবর্তন করুন' : 'Regularly update your password for security'}</p>
            </div>
          </div>

          {message && <div className="bg-green-50 border border-green-200 text-success-green px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2">✓ {message}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-court-red px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2">⚠ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400" />
                <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required
                  className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-4 text-gray-400" />
                  <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required minLength={8}
                    className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-4 text-gray-400" />
                  <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
                    className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
            </div>
            <Button type="submit" loading={loading} variant="primary" icon={<FiSave />}>{t('common.update')}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
