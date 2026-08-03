import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiClock } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../ui/Spinner';

export default function AuditLogs() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/audit-logs', { params: { limit: 100 } })
      .then(res => setLogs(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
            <FiClock className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'অডিট লগ' : 'Audit Logs'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'সিস্টেম কার্যক্রমের ইতিহাস' : 'System activity history'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-light-gray/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-transparent border-b border-light-gray/60">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'ব্যবহারকারী' : 'User'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'কার্যক্রম' : 'Action'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'মডেল' : 'Model'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'তারিখ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray/40">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-justice-blue">{log.user?.name || log.user?.email || '-'}</td>
                    <td className="px-6 py-4"><span className="capitalize text-sm font-semibold text-gray-700">{log.action}</span></td>
                    <td className="px-6 py-4 text-sm text-dark-gray">{log.model}</td>
                    <td className="px-6 py-4 text-sm text-dark-gray">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-dark-gray">{isBn ? 'কোন লগ পাওয়া যায়নি' : 'No logs found'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
