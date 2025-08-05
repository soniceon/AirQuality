import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <Search className="h-24 w-24" />
          </div>
          <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            {t('error.pageNotFound', '页面未找到')}
          </h2>
          <p className="mt-2 text-gray-500">
            {t('error.pageNotFoundDesc', '抱歉，您访问的页面不存在。')}
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            {t('nav.home', '返回首页')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('common.goBack', '返回上页')}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>{t('error.helpText', '如果您认为这是一个错误，请联系我们。')}</p>
          <Link to="/contact" className="text-blue-600 hover:text-blue-500">
            {t('nav.contact', '联系我们')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 