// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    translation: {
      welcome: 'Welcome to the Amhara Innovation and Technology Help Desk System',
      subtitle: 'Get support fast. Stay productive.',
      login: 'Login',
      register: 'Register',
      aboutUs: 'About Us'
    }
  },
  am: {
    translation: {
      welcome: 'እንኳን ወደ አማራ ኢኖቬሽንና ቴክኖሎጂ የአገልግሎት ማዕከል በደህና መጡ።',
      subtitle: 'እርዳታ በፍጥነት ያግኙ። ምርታማ ይሁኑ።',
      login: 'ግባ',
      register: 'ተመዝገብ',
      aboutUs: 'ስለ እኛ'
    }
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
