export default function Card({ children, className = '', title, subtitle, footer, hover = false, borderTop = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-card ${hover ? 'hover:shadow-card-hover hover:-translate-y-1' : ''} border border-light-gray/80 transition-all duration-300 ${borderTop ? 'border-t-4 border-t-justice-gold' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-light-gray/60">
          {title && <h3 className="text-xl font-bold text-justice-blue">{title}</h3>}
          {subtitle && <p className="text-sm text-dark-gray mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-light-gray/60 bg-off-white rounded-b-xl">{footer}</div>}
    </div>
  );
}
