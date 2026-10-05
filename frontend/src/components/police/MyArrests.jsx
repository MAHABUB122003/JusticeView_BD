import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUserPlus, FiUser } from 'react-icons/fi';
import { criminalService } from '../../services/criminalService';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';

export default function MyArrests() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [criminals, setCriminals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    criminalService.getAll({ limit: 50 })
      .then(res => setCriminals(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center shadow-lg">
              <FiUser className="text-2xl text-justice-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'আমার গ্রেফতার' : 'My Arrests'}</h1>
              <p className="text-dark-gray text-sm">{isBn ? 'রেকর্ডকৃত সকল গ্রেফতার' : 'All recorded arrests'}</p>
            </div>
          </div>
          <Link to="/police/arrest">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-justice-blue text-white rounded-xl font-semibold text-sm hover:bg-justice-blue-dark transition-all shadow-md hover:shadow-lg">
              <FiUserPlus /> {isBn ? '+ নতুন গ্রেফতার' : '+ New Arrest'}
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-light-gray/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-justice-blue/5 to-transparent border-b border-light-gray/60">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'নাম' : 'Name'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">NID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'মামলা' : 'Cases'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'জামিন' : 'Bails'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'পুনরাবৃত্ত' : 'Repeat'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray/40">
                {criminals.map((c) => (
                  <tr key={c._id} className="hover:bg-justice-blue/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/criminal/${c._id}`} className="text-justice-blue font-semibold hover:text-justice-gold transition-colors">
                        {isBn && c.name_bn ? c.name_bn : c.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-gray">{c.nid || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium">{c.totalCases}</td>
                    <td className="px-6 py-4 text-sm font-medium">{c.totalBails}</td>
                    <td className="px-6 py-4"><Badge variant={c.isRepeatOffender ? 'urgent' : 'normal'}>{c.isRepeatOffender ? (isBn ? 'হ্যাঁ' : 'Yes') : (isBn ? 'না' : 'No')}</Badge></td>
                    <td className="px-6 py-4 text-sm text-dark-gray">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {criminals.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-dark-gray">{isBn ? 'কোন গ্রেফতার পাওয়া যায়নি' : 'No arrests found'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
