import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const outcomeBadge = (outcome, isBn) => {
  const map = {
    bail_granted: { cls: 'bg-green-100 text-green-700', label: isBn ? 'জামিন মঞ্জুর' : 'Bail Granted' },
    bail_denied: { cls: 'bg-red-100 text-red-700', label: isBn ? 'জামিন নামঞ্জুর' : 'Bail Denied' },
    convicted: { cls: 'bg-red-100 text-red-700', label: isBn ? 'দোষী সাব্যস্ত' : 'Convicted' },
    acquitted: { cls: 'bg-green-100 text-green-700', label: isBn ? 'খালাস' : 'Acquitted' },
    pending: { cls: 'bg-yellow-100 text-yellow-700', label: isBn ? 'বিচারাধীন' : 'Pending' },
    disposed: { cls: 'bg-gray-100 text-gray-700', label: isBn ? 'নিষ্পত্তি' : 'Disposed' },
  };
  const m = map[outcome] || map.pending;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.cls}`}>{m.label}</span>;
};

export default function CaseHistoryTab({ cases = [] }) {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [filter, setFilter] = useState('all');

  const counts = {
    all: cases.length,
    bail_granted: cases.filter(c => c.outcome === 'bail_granted').length,
    convicted: cases.filter(c => c.outcome === 'convicted').length,
    pending: cases.filter(c => c.outcome === 'pending' || c.outcome === 'bail_denied').length,
  };

  const filtered = filter === 'all' ? cases : cases.filter(c => {
    if (filter === 'bail_granted') return c.outcome === 'bail_granted';
    if (filter === 'convicted') return c.outcome === 'convicted';
    if (filter === 'pending') return c.outcome === 'pending' || c.outcome === 'bail_denied';
    return true;
  });

  const tabs = [
    { key: 'all', label: isBn ? 'সব মামলা' : 'All Cases', count: counts.all, cls: 'bg-justice-blue text-white' },
    { key: 'bail_granted', label: isBn ? 'জামিন মঞ্জুর' : 'Bails Granted', count: counts.bail_granted, cls: 'bg-green-500 text-white' },
    { key: 'convicted', label: isBn ? 'দোষী সাব্যস্ত' : 'Convictions', count: counts.convicted, cls: 'bg-red-500 text-white' },
    { key: 'pending', label: isBn ? 'বিচারাধীন' : 'Pending', count: counts.pending, cls: 'bg-yellow-500 text-white' },
  ];

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-8 text-center">
        <p className="text-gray-500">{isBn ? 'কোন মামলার ইতিহাস নেই' : 'No case history found'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === tab.key ? tab.cls : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="divide-y divide-gray-100">
        {filtered.map((caseItem, idx) => (
          <div key={caseItem._id || idx} className="px-6 py-4 hover:bg-gray-50 transition">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-justice-navy">
                    {caseItem.case?.caseNumber || `Case #${caseItem._id?.slice(-6) || idx + 1}`}
                  </span>
                  {outcomeBadge(caseItem.outcome, isBn)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {caseItem.role_in_case?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  {caseItem.case?.sectionLaw && ` \u00B7 ${caseItem.case.sectionLaw}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(caseItem.date).toLocaleDateString()}
                </p>
              </div>
              {caseItem.case?._id && (
                <Link
                  to={`/case/${caseItem.case._id}`}
                  className="text-justice-gold hover:text-justice-gold-dark text-sm font-medium whitespace-nowrap"
                >
                  {isBn ? 'বিস্তারিত' : 'View Details'}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-6 py-8 text-center text-gray-500 text-sm">
          {isBn ? 'কোন মামলা পাওয়া যায়নি' : 'No cases found for this filter.'}
        </div>
      )}
    </div>
  );
}
