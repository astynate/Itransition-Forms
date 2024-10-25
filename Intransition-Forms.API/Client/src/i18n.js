import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json';
import translationBE from './locales/be.json';

const resources = {
  en: {
    translation: translationEN
  },
  be: {
    translation: translationBE
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false
    }
  });

export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
};

export default i18n;