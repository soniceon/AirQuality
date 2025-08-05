import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageDebug: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-2">语言调试信息</h3>
      <div className="text-xs space-y-1">
        <p><strong>当前语言:</strong> {i18n.language}</p>
        <p><strong>HTML lang:</strong> {document.documentElement.lang}</p>
        <p><strong>标题:</strong> {t('seo.defaultTitle')}</p>
        <p><strong>描述:</strong> {t('seo.defaultDescription').substring(0, 50)}...</p>
        <p><strong>关键词:</strong> {t('seo.defaultKeywords')}</p>
      </div>
    </div>
  );
};

export default LanguageDebug; 