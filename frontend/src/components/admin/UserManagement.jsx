import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function UserManagement() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}/status`, { isActive: !currentStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !currentStatus } : u));
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-court-red to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
            <FiUsers className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'ব্যবহারকারী ব্যবস্থাপনা' : 'User Management'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'সকল ব্যবহারকারীর অ্যাকাউন্ট পরিচালনা' : 'Manage all user accounts'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-light-gray/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-court-red/5 to-transparent border-b border-light-gray/60">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'নাম' : 'Name'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'ভূমিকা' : 'Role'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'অবস্থা' : 'Status'}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'কার্যক্রম' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray/40">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-court-red/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-justice-blue">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-dark-gray">{u.email}</td>
                    <td className="px-6 py-4"><Badge variant={u.role}>{u.role}</Badge></td>
                    <td className="px-6 py-4"><Badge variant={u.isActive ? 'active' : 'inactive'}>{u.isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}</Badge></td>
                    <td className="px-6 py-4">
                      <Button
                        variant={u.isActive ? 'danger' : 'success'}
                        size="sm"
                        icon={u.isActive ? <FiToggleLeft /> : <FiToggleRight />}
                        onClick={() => toggleStatus(u._id, u.isActive)}
                      >
                        {u.isActive ? (isBn ? 'নিষ্ক্রিয়' : 'Deactivate') : (isBn ? 'সক্রিয়' : 'Activate')}
                      </Button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-dark-gray">{isBn ? 'কোন ব্যবহারকারী পাওয়া যায়নি' : 'No users found'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
