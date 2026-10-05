import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function SearchBar({ large = false, className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  if (large) {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 h-14 sm:h-16 px-4 sm:px-6 text-base sm:text-lg bg-white rounded-xl sm:rounded-2xl shadow-xl focus:ring-4 focus:ring-justice-gold/30 focus:border-transparent text-gray-900"
        />
        <button
          type="submit"
          className="bg-justice-gold text-white px-6 sm:px-8 h-14 sm:h-16 rounded-xl sm:rounded-2xl font-bold hover:bg-justice-gold-dark transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-justice-gold/30"
        >
          <FiSearch className="text-lg" />
          <span>{t('common.search')}</span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search.placeholder')}
        className="w-full h-12 pl-12 pr-4 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-xl focus:bg-white focus:text-justice-blue focus:border-justice-gold transition-all duration-300 text-sm"
      />
      <FiSearch className="absolute left-4 top-3.5 text-white/60 text-lg" />
    </form>
  );
}
