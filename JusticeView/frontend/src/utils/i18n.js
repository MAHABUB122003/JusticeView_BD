import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '../locales/en/common.json';
import bnCommon from '../locales/bn/common.json';
import enAuth from '../locales/en/auth.json';
import bnAuth from '../locales/bn/auth.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
  },
  bn: {
    common: bnCommon,
    auth: bnAuth,
  },
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  ns: ['common', 'auth'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
