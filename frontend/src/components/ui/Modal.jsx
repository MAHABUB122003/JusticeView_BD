import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => { window.removeEventListener('keydown', handleEsc); };
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-modal-in`}>
        {title && (
          <div className="flex items-center justify-between px-8 py-5 border-b border-light-gray/80">
            <h3 className="text-2xl font-bold text-justice-blue">{title}</h3>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <FiX className="text-xl" />
            </button>
          </div>
        )}
        <div className="px-8 py-6">{children}</div>
        {footer && <div className="px-8 py-4 border-t border-light-gray/80 bg-off-white rounded-b-2xl flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
