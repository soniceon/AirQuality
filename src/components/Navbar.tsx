import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/science', label: t('nav.science', '科普文章') },
    { path: '/faq', label: t('nav.faq', '常见问题') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];
  return (
    <nav className="flex items-center justify-between py-4 bg-white shadow mb-8 px-8 rounded-xl max-w-6xl mx-auto" aria-label="主导航">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-700 hover:text-blue-900 whitespace-nowrap">
        <Wind className="h-7 w-7 text-blue-600" />
        AirQuality.Tools
      </Link>
      <div className="flex-1 flex items-center justify-between ml-8">
        <div className="flex gap-6 whitespace-nowrap">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className="font-medium text-gray-700 hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ml-8">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
} 