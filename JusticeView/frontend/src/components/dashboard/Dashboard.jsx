import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiFileText, FiShield, FiBookOpen, FiUsers, FiTrendingUp, FiArrowRight, FiPackage, FiCalendar, FiSearch } from 'react-icons/fi';
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
  const isCourt = user?.role === 'court_clerk' || user?.role === 'judge';
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Link to="/police/charge-sheet"><Button variant="outline" size="sm" icon={<FiFileText />}>{isBn ? 'চার্জশিট' : 'Charge Sheet'}</Button></Link>
              </>
            )}
            {isCourt && (
              <>
                <Link to="/court/bail"><Button variant="gold" size="sm" icon={<FiBookOpen />}>{isBn ? 'জামিন' : 'Bail'}</Button></Link>
                <Link to="/court/judgment"><Button variant="danger" size="sm" icon={<FiFileText />}>{isBn ? 'রায়' : 'Judgment'}</Button></Link>
                <Link to="/court/punishment"><Button variant="outline" size="sm" icon={<FiShield />}>{isBn ? 'শাস্তি' : 'Punishment'}</Button></Link>
              </>
            )}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard number={stats.totalCases?.toLocaleString()} label={isBn ? 'মোট মামলা' : 'Total Cases'} icon={<FiFileText />} color="justice-blue" />
            <StatCard number={stats.totalCriminals?.toLocaleString()} label={isBn ? 'মোট অপরাধী' : 'Total Criminals'} icon={<FiUsers />} color="court-red" />
            <StatCard number={stats.totalBails?.toLocaleString()} label={isBn ? 'মোট জামিন' : 'Total Bails'} icon={<FiShield />} color="justice-gold" />
            <StatCard number={stats.pendingCases?.toLocaleString()} label={isBn ? 'বিচারাধীন' : 'Pending'} icon={<FiTrendingUp />} color="info-blue" />
          </div>
        )}

        {isPolice && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard number={stats.todayArrests || 0} label={isBn ? 'আজ গ্রেফতার' : 'Arrest Today'} icon={<FiShield />} color="court-red" />
            <StatCard number={stats.weekArrests || 0} label={isBn ? 'এই সপ্তাহে' : 'This Week'} icon={<FiTrendingUp />} color="justice-gold" />
            <StatCard number={stats.chargeSheetsFiled || 0} label={isBn ? 'চার্জশিট দাখিল' : 'Charge Sheets'} icon={<FiFileText />} color="success-green" />
            <StatCard number={stats.evidenceCollected || 0} label={isBn ? 'প্রমাণ সংগ্রহ' : 'Evidence'} icon={<FiPackage />} color="info-blue" />
          </div>
        )}

        {isCourt && stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard number={stats.totalJudgments || 0} label={isBn ? 'মোট রায়' : 'Judgments'} icon={<FiFileText />} color="court-red" />
            <StatCard number={stats.pendingJudgments || 0} label={isBn ? 'বিচারাধীন' : 'Pending'} icon={<FiTrendingUp />} color="justice-gold" />
            <StatCard number={stats.todayHearings || 0} label={isBn ? 'আজকের শুনানি' : "Today's Hearings"} icon={<FiCalendar />} color="info-blue" />
            <StatCard number={stats.totalPunishments || 0} label={isBn ? 'শাস্তি' : 'Punishments'} icon={<FiShield />} color="court-red" />
          </div>
        )}

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
                  <Link to="/police/charge-sheet" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-info-blue to-blue-600 text-white hover:scale-105 transition-transform">
                    <FiFileText className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'চার্জশিট' : 'Charge Sheet'}</span>
                  </Link>
                  <Link to="/police/evidence" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-success-green to-green-600 text-white hover:scale-105 transition-transform">
                    <FiPackage className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'প্রমাণ' : 'Evidence'}</span>
                  </Link>
                </>
              )}
              {isCourt && (
                <>
                  <Link to="/court/bail" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-justice-gold to-yellow-600 text-white hover:scale-105 transition-transform">
                    <FiBookOpen className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'জামিন এন্ট্রি' : 'Bail Entry'}</span>
                  </Link>
                  <Link to="/court/judgment" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-court-red to-red-700 text-white hover:scale-105 transition-transform">
                    <FiFileText className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'রায় এন্ট্রি' : 'Judgment'}</span>
                  </Link>
                  <Link to="/court/punishment" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white hover:scale-105 transition-transform">
                    <FiShield className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'শাস্তি' : 'Punishment'}</span>
                  </Link>
                  <Link to="/court/hearing" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-info-blue to-blue-600 text-white hover:scale-105 transition-transform">
                    <FiCalendar className="text-2xl" />
                    <span className="text-xs font-semibold">{isBn ? 'শুনানি' : 'Hearing'}</span>
                  </Link>
                </>
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
              {user?.policeStation && (
                <div className="flex justify-between items-center py-2 border-b border-light-gray/60">
                  <span className="text-dark-gray">{isBn ? 'থানা' : 'Police Station'}</span>
                  <span className="font-semibold text-justice-blue">{user.policeStation}</span>
                </div>
              )}
              {user?.courtName && (
                <div className="flex justify-between items-center py-2 border-b border-light-gray/60">
                  <span className="text-dark-gray">{isBn ? 'আদালত' : 'Court'}</span>
                  <span className="font-semibold text-justice-blue">{user.courtName}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-dark-gray">{isBn ? 'অ্যাকাউন্ট সক্রিয়' : 'Account Active'}</span>
                <span className="px-3 py-1 bg-green-50 text-success-green rounded-full text-xs font-semibold border border-green-200">
                  {isBn ? 'সক্রিয়' : 'Active'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {isPolice && (
          <Card title={isBn ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activities'}>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-light-gray/60">
                <div className="w-2 h-2 rounded-full bg-success-green"></div>
                <span className="text-sm text-dark-gray">10:30 AM - {isBn ? 'মামলা #345/2024 আপডেট করা হয়েছে' : 'Case #345/2024 Updated'}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-light-gray/60">
                <div className="w-2 h-2 rounded-full bg-justice-gold"></div>
                <span className="text-sm text-dark-gray">09:15 AM - {isBn ? 'নতুন গ্রেফতার: মোঃ রহমান' : 'New Arrest: Md. Rahman'}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-light-gray/60">
                <div className="w-2 h-2 rounded-full bg-info-blue"></div>
                <span className="text-sm text-dark-gray">08:45 AM - {isBn ? 'চার্জশিট দাখিল: মামলা #344/2024' : 'Charge Sheet Filed: Case #344/2024'}</span>
              </div>
            </div>
          </Card>
        )}

        {isCourt && (
          <Card title={isBn ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activities'}>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-light-gray/60">
                <div className="w-2 h-2 rounded-full bg-success-green"></div>
                <span className="text-sm text-dark-gray">{isBn ? 'রায় প্রদান: মামলা #342/2024' : 'Judgment Given: Case #342/2024'}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-light-gray/60">
                <div className="w-2 h-2 rounded-full bg-justice-gold"></div>
                <span className="text-sm text-dark-gray">{isBn ? 'জামিন মঞ্জুর: মোঃ করিম' : 'Bail Granted: Md. Karim'}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-light-gray/60">
                <div className="w-2 h-2 rounded-full bg-info-blue"></div>
                <span className="text-sm text-dark-gray">{isBn ? 'শুনানি নির্ধারিত: মামলা #341/2024' : 'Hearing Scheduled: Case #341/2024'}</span>
              </div>
            </div>
          </Card>
        )}

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
