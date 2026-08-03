import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBookOpen } from 'react-icons/fi';
import { caseService } from '../../services/caseService';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';

export default function CaseList() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caseService.getAll({ limit: 50 })
      .then(res => setCases(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-justice-gold to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiBookOpen className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'মামলার তালিকা' : 'Case List'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'সকল মামলার তথ্য' : 'All case records'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-light-gray/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-justice-gold/5 to-transparent border-b border-light-gray/60">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'মামলা নম্বর' : 'Case #'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'অপরাধী' : 'Criminal'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'অবস্থা' : 'Status'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'গ্রেফতার তারিখ' : 'Arrest Date'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'ধারা' : 'Section'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray/40">
                {cases.map((c) => (
                  <tr key={c._id} className="hover:bg-justice-gold/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/case/${c._id}`} className="text-justice-blue font-semibold hover:text-justice-gold transition-colors">{c.caseNumber}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {c.criminal ? (
                        <Link to={`/criminal/${c.criminal._id}`} className="text-justice-blue hover:text-justice-gold transition-colors">
                          {isBn && c.criminal.name_bn ? c.criminal.name_bn : c.criminal.name}
                        </Link>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4"><Badge variant={c.status}>{c.status}</Badge></td>
                    <td className="px-6 py-4 text-sm text-dark-gray">{new Date(c.arrestDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-dark-gray font-mono">{c.sectionLaw || '-'}</td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-dark-gray">{isBn ? 'কোন মামলা পাওয়া যায়নি' : 'No cases found'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
