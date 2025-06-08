import React from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n/config';

const RTL_LANGS = ['ar', 'ur', 'he', 'fa'];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
    localStorage.setItem('preferredLanguage', lng);
  };

  React.useEffect(() => {
    // 初始化时自动设置lang和dir
    const lng = i18n.language;
    document.documentElement.lang = lng;
    document.documentElement.dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        {Object.entries(supportedLanguages).map(([code, { name, nativeName }]) => (
          <option key={code} value={code}>
            {nativeName} ({name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher; 