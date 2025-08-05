import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

export default function About() {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead 
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDescription')}
        canonical="https://airquality.tools/about"
        ogType="website"
      />
      <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-gray-700 mb-4">{t('about.intro')}</p>
        <p className="text-gray-700">{t('about.team')}</p>
        <p className="text-gray-700 mt-8">{t('about.footer')}</p>
      </main>
    </>
  );
} 