import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiX } from 'react-icons/fi';
import { divisionService } from '../../services/divisionService';

export default function ProfessionalSearch({ onSearch, filters, onFilterChange }) {
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    divisionService.getAll().then(res => {
      const allDistricts = res.data.data?.flatMap(d => d.districts || []) || [];
      setDistricts(allDistricts);
    }).catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ ...filters, q: searchTerm });
  };

  const clearFilter = (key) => {
    const updated = { ...filters, [key]: '' };
    onFilterChange?.(updated);
  };

  const activeFilters = Object.entries(filters).filter(([k, v]) => v && k !== 'q');

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder={t('directory.searchPlaceholder') || 'Search by name, designation, Bar Council No, Badge No...'}
            className="w-full h-14 px-6 pr-32 text-lg border-2 border-gray-200 rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-justice-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-justice-gold-dark transition"
          >
            <FiSearch className="inline mr-1" /> {t('common.search') || 'Search'}
          </button>
        </div>
      </form>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filters.role || 'all'}
          onChange={(e) => onFilterChange?.({ ...filters, role: e.target.value === 'all' ? '' : e.target.value })}
          className="h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold transition"
        >
          <option value="all">{t('directory.allProfessionals') || 'All Professionals'}</option>
          <option value="police_officer">{t('directory.police') || 'Police Officers'}</option>
          <option value="lawyer">{t('directory.lawyers') || 'Lawyers'}</option>
          <option value="judge">{t('directory.judges') || 'Judges'}</option>
          <option value="magistrate">{t('directory.magistrates') || 'Magistrates'}</option>
          <option value="court_official">{t('directory.courtOfficials') || 'Court Officials'}</option>
        </select>

        <select
          value={filters.district || ''}
          onChange={(e) => onFilterChange?.({ ...filters, district: e.target.value })}
          className="h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold transition"
        >
          <option value="">{t('directory.allDistricts') || 'All Districts'}</option>
          {districts.map(d => (
            <option key={d._id} value={d._id}>{d.name_bn || d.name}</option>
          ))}
        </select>

        <select
          value={filters.specialization || ''}
          onChange={(e) => onFilterChange?.({ ...filters, specialization: e.target.value })}
          className="h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold transition"
        >
          <option value="">{t('directory.allSpecializations') || 'All Specializations'}</option>
          <option value="Criminal">{t('directory.criminalLaw') || 'Criminal Law'}</option>
          <option value="Civil">{t('directory.civilLaw') || 'Civil Law'}</option>
          <option value="Family">{t('directory.familyLaw') || 'Family Law'}</option>
          <option value="Corporate">{t('directory.corporateLaw') || 'Corporate Law'}</option>
          <option value="Human Rights">{t('directory.humanRights') || 'Human Rights'}</option>
        </select>

        <select
          value={filters.verification_status || ''}
          onChange={(e) => onFilterChange?.({ ...filters, verification_status: e.target.value })}
          className="h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold transition"
        >
          <option value="">{t('directory.allStatus') || 'All Status'}</option>
          <option value="verified">{t('directory.verified') || 'Verified'}</option>
          <option value="pending">{t('directory.pending') || 'Pending'}</option>
          <option value="rejected">{t('directory.rejected') || 'Rejected'}</option>
        </select>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeFilters.map(([key, value]) => (
            <span
              key={key}
              className="px-3 py-1 bg-justice-blue/10 text-justice-blue rounded-full text-sm flex items-center gap-2"
            >
              {value}
              <button onClick={() => clearFilter(key)} className="hover:text-red-500">
                <FiX />
              </button>
            </span>
          ))}
          <button
            onClick={() => onFilterChange?.({})}
            className="px-3 py-1 text-gray-500 hover:text-justice-navy text-sm"
          >
            {t('directory.clearAll') || 'Clear All Filters'}
          </button>
        </div>
      )}
    </div>
  );
}
