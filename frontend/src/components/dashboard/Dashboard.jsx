import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiFileText, FiShield, FiBookOpen, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService } from '../../services/analyticsService';
import StatCard from '../ui/StatCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner size="lg" text={isBn ? 'ড্যাশবোর্ড লোড হচ্ছে...' : 'Loading dashboard...'} /></div>;

  const isPolice = user?.role === 'police_officer';
  const isCourt = user?.role === 'court_clerk';
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">
              {isBn ? 'ড্যাশবোর্ডে স্বাগতম' : 'Welcome Back'}
            </h1>
            <p className="text-dark-gray mt-1">
              {isBn ? 'আপনার বিচার ব্যবস্থার ওভারভিউ' : 'Your judicial system overview'} • <span className="text-justice-gold font-semibold">{user?.name}</span>
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {isPolice && (
              <>
                <Link to="/police/arrest"><Button variant="primary" size="sm" icon={<FiPlus />}>{isBn ? 'গ্রেফতার' : 'Arrest'}</Button></Link>
                <Link to="/police/case"><Button variant="gold" size="sm" icon={<FiFileText />}>{isBn ? 'মামলা' : 'Case'}</Button></Link>
              </>
            )}
            {isCourt && (
              <Link to="/court/bail"><Button variant="gold" size="sm" icon={<FiBookOpen />}>{isBn ? 'জামিন' : 'Bail'}</Button></Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard number={stats.totalCases?.toLocaleString()} label={isBn ? 'মোট মামলা' : 'Total Cases'} icon={<FiFileText />} color="justice-blue" />
            <StatCard number={stats.totalCriminals?.toLocaleString()} label={isBn ? 'মোট অপরাধী' : 'Total Criminals'} icon={<FiUsers />} color="court-red" />
            <StatCard number={stats.totalBails?.toLocaleString()} label={isBn ? 'মোট জামিন' : 'Total Bails'} icon={<FiShield />} color="justice-gold" />
            <StatCard number={stats.pendingCases?.toLocaleString()} label={isBn ? 'বিচারাধীন' : 'Pending'} icon={<FiTrendingUp />} color="info-blue" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card title={isBn ? 'দ্রুত কর্ম' : 'Quick Actions'} hover>
            <div className="grid grid-cols-2 gap-4">
              {isPolice && (
                <>
                  <Link to="/police/arrest" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-justice-blue to-justice-blue-light text-white hover:scale-105 transition-transform">
                    <FiPlus className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'নতুন গ্রেফতার' : 'New Arrest'}</span>
                  </Link>
                  <Link to="/police/case" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-justice-gold to-yellow-600 text-white hover:scale-105 transition-transform">
                    <FiFileText className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'নতুন মামলা' : 'New Case'}</span>
                  </Link>
                </>
              )}
              {isCourt && (
                <Link to="/court/bail" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-justice-gold to-yellow-600 text-white hover:scale-105 transition-transform">
                  <FiBookOpen className="text-2xl" />
                  <span className="text-xs font-semibold">{isBn ? 'জামিন এন্ট্রি' : 'Bail Entry'}</span>
                </Link>
              )}
              <Link to="/search" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-success-green to-green-600 text-white hover:scale-105 transition-transform">
                <FiUsers className="text-2xl" />
                <span className="text-xs font-semibold">{isBn ? 'অনুসন্ধান' : 'Search'}</span>
              </Link>
              <Link to="/profile" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-info-blue to-blue-600 text-white hover:scale-105 transition-transform">
                <FiShield className="text-2xl" />
                <span className="text-xs font-semibold">{isBn ? 'প্রোফাইল' : 'Profile'}</span>
              </Link>
            </div>
          </Card>

          <Card title={isBn ? 'সিস্টেম তথ্য' : 'System Info'}>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-light-gray/60">
                <span className="text-dark-gray">{isBn ? 'আপনার ভূমিকা' : 'Your Role'}</span>
                <span className="font-semibold text-justice-blue capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-light-gray/60">
                <span className="text-dark-gray">Email</span>
                <span className="font-semibold text-justice-blue">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-gray">{isBn ? 'অ্যাকাউন্ট সক্রিয়' : 'Account Active'}</span>
                <span className="px-3 py-1 bg-green-50 text-success-green rounded-full text-xs font-semibold border border-green-200">
                  {isBn ? 'সক্রিয়' : 'Active'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Role-specific quick links */}
        {isAdmin && (
          <Card title={isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { to: '/admin/users', label: isBn ? 'ব্যবহারকারী' : 'Users', icon: <FiUsers /> },
                { to: '/admin/thanas', label: isBn ? 'থানা' : 'Thanas', icon: <FiShield /> },
                { to: '/admin/courts', label: isBn ? 'আদালত' : 'Courts', icon: <FiBookOpen /> },
                { to: '/admin/logs', label: isBn ? 'লগ' : 'Logs', icon: <FiFileText /> },
              ].map((item, i) => (
                <Link key={i} to={item.to} className="flex items-center gap-3 p-4 rounded-xl border border-light-gray/60 hover:bg-off-white hover:border-justice-gold/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-justice-blue/5 flex items-center justify-center text-justice-blue group-hover:bg-justice-gold group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
