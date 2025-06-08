import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import km from './locales/km.json';
import ur from './locales/ur.json';
import el from './locales/el.json';
import tr from './locales/tr.json';
import ne from './locales/ne.json';
import bs from './locales/bs.json';
import sr from './locales/sr.json';
import hr from './locales/hr.json';
import ga from './locales/ga.json';

// 支持的语言列表
export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English' },
  'zh-CN': { name: '简体中文', nativeName: '简体中文' },
  'zh-TW': { name: '繁體中文', nativeName: '繁體中文' },
  ja: { name: '日本語', nativeName: '日本語' },
  ko: { name: '한국어', nativeName: '한국어' },
  es: { name: 'Español', nativeName: 'Español' },
  fr: { name: 'Français', nativeName: 'Français' },
  de: { name: 'Deutsch', nativeName: 'Deutsch' },
  ar: { name: 'العربية', nativeName: 'العربية' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  el: { name: 'Ελληνικά', nativeName: 'Ελληνικά' },
  tr: { name: 'Türkçe', nativeName: 'Türkçe' },
  ne: { name: 'नेपाली', nativeName: 'नेपाली' },
  bs: { name: 'Bosanski', nativeName: 'Bosanski' },
  sr: { name: 'Српски', nativeName: 'Српски' },
  hr: { name: 'Hrvatski', nativeName: 'Hrvatski' },
  ga: { name: 'Gaeilge', nativeName: 'Gaeilge' }
};

// 初始化i18n配置
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-CN': { translation: zhCN },
      'zh-TW': { translation: zhTW },
      ja: { translation: ja },
      ko: { translation: ko },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      ar: { translation: ar },
      hi: { translation: hi },
      km: { translation: km },
      ur: { translation: ur },
      el: { translation: el },
      tr: { translation: tr },
      ne: { translation: ne },
      bs: { translation: bs },
      sr: { translation: sr },
      hr: { translation: hr },
      ga: { translation: ga }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    }
  });

export default i18n; 