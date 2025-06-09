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
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', flagImg: 'https://flagcdn.com/us.svg' },
  'zh-CN': { name: '简体中文', nativeName: '简体中文', flag: '🇨🇳', flagImg: 'https://flagcdn.com/cn.svg' },
  'zh-TW': { name: '繁體中文', nativeName: '繁體中文', flag: '🇹🇼', flagImg: 'https://flagcdn.com/tw.svg' },
  ja: { name: '日本語', nativeName: '日本語', flag: '🇯🇵', flagImg: 'https://flagcdn.com/jp.svg' },
  ko: { name: '한국어', nativeName: '한국어', flag: '🇰🇷', flagImg: 'https://flagcdn.com/kr.svg' },
  es: { name: 'Español', nativeName: 'Español', flag: '🇪🇸', flagImg: 'https://flagcdn.com/es.svg' },
  fr: { name: 'Français', nativeName: 'Français', flag: '🇫🇷', flagImg: 'https://flagcdn.com/fr.svg' },
  de: { name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', flagImg: 'https://flagcdn.com/de.svg' },
  ar: { name: 'العربية', nativeName: 'العربية', flag: '🇸🇦', flagImg: 'https://flagcdn.com/sa.svg' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', flagImg: 'https://flagcdn.com/in.svg' },
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', flagImg: 'https://flagcdn.com/kh.svg' },
  ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', flagImg: 'https://flagcdn.com/pk.svg' },
  el: { name: 'Ελληνικά', nativeName: 'Ελληνικά', flag: '🇬🇷', flagImg: 'https://flagcdn.com/gr.svg' },
  tr: { name: 'Türkçe', nativeName: 'Türkçe', flag: '🇹🇷', flagImg: 'https://flagcdn.com/tr.svg' },
  ne: { name: 'नेपाली', nativeName: 'नेपाली', flag: '🇳🇵', flagImg: 'https://flagcdn.com/np.svg' },
  bs: { name: 'Bosanski', nativeName: 'Bosanski', flag: '🇧🇦', flagImg: 'https://flagcdn.com/ba.svg' },
  sr: { name: 'Српски', nativeName: 'Српски', flag: '🇷🇸', flagImg: 'https://flagcdn.com/rs.svg' },
  hr: { name: 'Hrvatski', nativeName: 'Hrvatski', flag: '🇭🇷', flagImg: 'https://flagcdn.com/hr.svg' },
  ga: { name: 'Gaeilge', nativeName: 'Gaeilge', flag: '🇮🇪', flagImg: 'https://flagcdn.com/ie.svg' }
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