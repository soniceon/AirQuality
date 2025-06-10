import React from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n/config';
import { Listbox } from '@headlessui/react';

const RTL_LANGS = ['ar', 'ur', 'he', 'fa'];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const langList = Object.entries(supportedLanguages);
  const selected = langList.find(([code]) => code === currentLang) || langList[0];
  const isRTL = RTL_LANGS.includes(currentLang);

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
    <div className="relative inline-block align-middle" style={{ minWidth: 0 }}>
      <Listbox value={currentLang} onChange={changeLanguage}>
        <Listbox.Button className="flex items-center justify-between px-2 py-2 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 cursor-pointer min-w-0" style={{ width: 'auto', minWidth: 120, maxWidth: 'none' }}>
          <span className="flex items-center">
            <img src={selected[1].flagImg} alt={selected[1].name} className="w-5 h-5 mr-1 rounded-sm object-cover" loading="lazy" />
            <span style={{maxWidth: 200, whiteSpace: 'nowrap'}}>{selected[1].nativeName}</span>
          </span>
          <svg className="w-4 h-4 ml-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </Listbox.Button>
        <Listbox.Options
          className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none"
          style={{
            minWidth: 180,
            width: 'max-content',
            left: isRTL ? 'auto' : 0,
            right: isRTL ? 0 : 'auto',
            direction: isRTL ? 'rtl' : 'ltr',
            maxWidth: 'none',
            maxHeight: 'none',
            overflow: 'visible'
          }}
        >
          {langList.map(([code, { nativeName, flagImg }]) => (
            <Listbox.Option
              key={code}
              value={code}
              className={({ active, selected }) =>
                `flex items-center px-2 py-2 cursor-pointer select-none transition-colors ${active ? 'bg-blue-100 text-blue-900' : ''} ${selected ? 'font-bold' : ''}`
              }
            >
              <img src={flagImg} alt={nativeName} className="w-5 h-5 mr-1 rounded-sm object-cover" loading="lazy" />
              <span style={{maxWidth: 200, whiteSpace: 'nowrap'}}>{nativeName}</span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default LanguageSwitcher; 