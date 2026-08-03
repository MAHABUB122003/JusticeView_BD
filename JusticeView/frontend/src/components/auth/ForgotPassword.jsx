import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiArrowLeft, FiShield, FiCheckCircle } from 'react-icons/fi';
import Button from '../ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['common', 'auth']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: Implement actual password reset API
      await new Promise(r => setTimeout(r, 1000));
      setSent(true);
    } catch {
      setError('Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-off-white to-gray-100 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <FiCheckCircle className="text-3xl text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h1>
          <p className="text-gray-500 mb-6">If an account exists for {email}, you will receive a password reset link.</p>
          <Link to="/login" className="text-justice-gold font-medium hover:underline">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white to-gray-100 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-justice-blue rounded-2xl mb-4 shadow-lg">
            <FiShield className="text-2xl text-justice-gold" />
          </div>
          <h1 className="text-3xl font-extrabold text-justice-blue">Forgot Password</h1>
          <p className="text-dark-gray mt-2">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-form p-8 border border-light-gray/60">
          {error && (
            <div className="bg-red-50 border border-red-200 text-court-red px-5 py-4 rounded-xl mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link to="/login" className="text-justice-gold font-medium hover:underline inline-flex items-center gap-1">
            <FiArrowLeft /> Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
