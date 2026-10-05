import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white/10 rounded-lg p-0.5">
      <button
        onClick={() => language !== 'en' && toggleLanguage()}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === 'en' ? 'bg-justice-gold text-white shadow-sm' : 'text-white/70 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => language !== 'bn' && toggleLanguage()}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === 'bn' ? 'bg-justice-gold text-white shadow-sm' : 'text-white/70 hover:text-white'
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
