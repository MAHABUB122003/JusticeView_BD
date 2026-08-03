import { useTranslation } from 'react-i18next';

export default function ProfessionalStats({ stats }) {
  const { t } = useTranslation('common');

  const items = [
    {
      label: t('directory.totalCases') || 'Total Cases',
      value: stats.total_cases_handled || 0,
      color: 'border-l-4 border-justice-gold',
      valueClass: 'text-justice-navy',
    },
    {
      label: t('directory.bailsGranted') || 'Bails Granted',
      value: stats.total_bails_granted || 0,
      color: 'border-l-4 border-green-500',
      valueClass: 'text-green-600',
    },
    {
      label: t('directory.convictions') || 'Convictions',
      value: stats.total_convictions || 0,
      color: 'border-l-4 border-red-500',
      valueClass: 'text-red-600',
    },
    {
      label: t('directory.activeCases') || 'Active Cases',
      value: (stats.total_cases_handled || 0) - (stats.total_convictions || 0),
      color: 'border-l-4 border-purple-500',
      valueClass: 'text-purple-600',
    },
    {
      label: t('directory.successRate') || 'Success Rate',
      value: stats.total_cases_handled > 0
        ? Math.round(((stats.total_bails_granted || 0) + (stats.total_convictions || 0)) / stats.total_cases_handled * 100) + '%'
        : '0%',
      color: 'border-l-4 border-blue-500',
      valueClass: 'text-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, i) => (
        <div key={i} className={`bg-white rounded-xl shadow-card p-6 text-center ${item.color}`}>
          <p className={`text-3xl font-bold ${item.valueClass}`}>{item.value}</p>
          <p className="text-sm text-gray-600 mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
