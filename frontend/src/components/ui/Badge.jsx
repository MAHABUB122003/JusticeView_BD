const variants = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  trial: 'bg-blue-50 text-blue-700 border-blue-200',
  disposed: 'bg-green-50 text-success-green border-green-200',
  appealed: 'bg-red-50 text-court-red border-red-200',
  active: 'bg-green-50 text-success-green border-green-200',
  inactive: 'bg-gray-50 text-dark-gray border-gray-200',
  normal: 'bg-gray-50 text-gray-600 border-gray-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-court-red border-red-200',
  repeat: 'bg-red-50 text-court-red border-red-200',
  bailed: 'bg-amber-50 text-justice-gold-dark border-amber-200',
  super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-blue-50 text-info-blue border-blue-200',
  police_officer: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  court_clerk: 'bg-teal-50 text-teal-700 border-teal-200',
  public_user: 'bg-gray-50 text-dark-gray border-gray-200',
};

const indicators = {
  pending: '🟡',
  trial: '🔵',
  disposed: '🟢',
  appealed: '🔴',
  active: '🟢',
  inactive: '⚪',
  repeat: '🔴',
  bailed: '🟡',
  urgent: '🔴',
};

export default function Badge({ children, variant = 'pending', className = '', showIndicator = false, ...props }) {
  const colorClass = variants[variant] || variants.pending;
  const indicator = indicators[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} ${className}`} {...props}>
      {showIndicator && indicator && <span>{indicator}</span>}
      {children}
    </span>
  );
}
