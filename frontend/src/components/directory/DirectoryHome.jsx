import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { professionalService } from '../../services/professionalService';
import ProfessionalCard from './ProfessionalCard';
import ProfessionalSearch from './ProfessionalSearch';
import Spinner from '../ui/Spinner';

const roleMap = {
  police_officer: { label: { en: 'Police', bn: 'পুলিশ' }, color: 'bg-blue-500' },
  lawyer: { label: { en: 'Lawyers', bn: 'উকিল' }, color: 'bg-purple-500' },
  judge: { label: { en: 'Judges', bn: 'বিচারক' }, color: 'bg-red-500' },
  magistrate: { label: { en: 'Magistrates', bn: 'ম্যাজিস্ট্রেট' }, color: 'bg-yellow-500' },
};

export default function DirectoryHome() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [professionals, setProfessionals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    Promise.all([
      professionalService.getAll({ ...filters, limit: 12 }),
      professionalService.getStats(),
    ])
      .then(([listRes, statsRes]) => {
        setProfessionals(listRes.data.data);
        setPagination(listRes.data.pagination);
        setStats(statsRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  const handleSearch = (params) => {
    setLoading(true);
    professionalService.search({ q: params.q, role: params.role, limit: 12 })
      .then(res => {
        setProfessionals(res.data.data);
        setPagination(null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-justice-navy mb-3">
            {isBn ? 'প্রফেশনাল ডিরেক্টরি' : 'Professional Directory'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isBn
              ? 'বাংলাদেশের বিচার বিভাগ এবং আইন প্রয়োগকারী পেশাদারদের সম্পূর্ণ ডিরেক্টরি'
              : "Bangladesh's Complete Judicial & Law Enforcement Directory"}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <ProfessionalSearch
            onSearch={handleSearch}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setFilters({})}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${!filters.role ? 'bg-justice-gold text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            {isBn ? 'সব' : 'All'}
          </button>
          {Object.entries(roleMap).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilters(prev => ({ ...prev, role: key }))}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${filters.role === key ? 'bg-justice-gold text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {isBn ? val.label.bn : val.label.en}
            </button>
          ))}
          <Link
            to="/directory/register"
            className="px-5 py-2 rounded-full text-sm font-medium bg-justice-blue text-white hover:bg-justice-navy transition"
          >
            {isBn ? '+ নিবন্ধন' : '+ Register'}
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-card p-4 text-center border-l-4 border-justice-gold">
              <p className="text-2xl font-bold text-justice-navy">{stats.total?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-500">{isBn ? 'মোট' : 'Total'}</p>
            </div>
            {Object.entries(roleMap).map(([key, val]) => (
              <div key={key} className={`bg-white rounded-xl shadow-card p-4 text-center border-l-4 ${val.color.replace('bg-', 'border-')}-500`}>
                <p className="text-2xl font-bold text-gray-900">{stats[key]?.count?.toLocaleString() || 0}+</p>
                <p className="text-xs text-gray-500">{isBn ? val.label.bn : val.label.en}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" text={isBn ? 'লোড হচ্ছে...' : 'Loading...'} /></div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{isBn ? 'কোন প্রফেশনাল পাওয়া যায়নি' : 'No professionals found'}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {professionals.map(p => (
                <ProfessionalCard key={p._id} professional={p} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${p === pagination.page ? 'bg-justice-gold text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
