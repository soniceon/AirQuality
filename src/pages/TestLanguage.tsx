import React from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

const TestLanguage: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEOHead 
        title={t('seo.defaultTitle')}
        description={t('seo.defaultDescription')}
        canonical="https://airquality.tools/test"
      />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">语言切换测试页面</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">当前语言信息</h2>
          <p><strong>当前语言:</strong> {i18n.language}</p>
          <p><strong>HTML lang属性:</strong> {document.documentElement.lang}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">SEO内容测试</h2>
          <p><strong>标题:</strong> {t('seo.defaultTitle')}</p>
          <p><strong>描述:</strong> {t('seo.defaultDescription')}</p>
          <p><strong>关键词:</strong> {t('seo.defaultKeywords')}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">页面内容测试</h2>
          <p><strong>主页标题:</strong> {t('home.title')}</p>
          <p><strong>搜索占位符:</strong> {t('home.searchPlaceholder')}</p>
          <p><strong>热门城市:</strong> {t('home.popularCities')}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">导航测试</h2>
          <p><strong>首页:</strong> {t('nav.home')}</p>
          <p><strong>关于:</strong> {t('nav.about')}</p>
          <p><strong>联系:</strong> {t('nav.contact')}</p>
          <p><strong>FAQ:</strong> {t('nav.faq')}</p>
          <p><strong>科学:</strong> {t('nav.science')}</p>
        </div>
      </div>
    </>
  );
};

export default TestLanguage; 