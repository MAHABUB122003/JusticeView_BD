export default function StatCard({ number, label, icon, color = 'justice-blue', change, className = '' }) {
  const colors = {
    'justice-blue': 'from-justice-blue to-justice-blue-light',
    'justice-gold': 'from-justice-gold to-justice-gold-dark',
    'court-red': 'from-court-red to-red-700',
    'success-green': 'from-success-green to-green-700',
    'info-blue': 'from-info-blue to-blue-700',
  };

  return (
    <div className={`bg-white rounded-xl shadow-card p-6 border border-light-gray/60 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-dark-gray">{label}</span>
        {icon && (
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors[color] || colors['justice-blue']} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-extrabold text-justice-blue">{number}</span>
        {change !== undefined && (
          <span className={`text-sm font-semibold mb-1 ${change >= 0 ? 'text-success-green' : 'text-court-red'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}
