import { createContext, useState, useContext } from 'react';
import i18n from '../utils/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'en');

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    document.title = lang === 'bn' ? 'জাস্টিসভিউ' : 'JusticeView';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
