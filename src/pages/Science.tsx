import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

export default function Science() {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead 
        title={t('seo.scienceTitle')}
        description={t('seo.scienceDescription')}
        canonical="https://airquality.tools/science"
        ogType="article"
      />
      <main className="flex justify-center items-start py-12 px-2 min-h-[60vh]">
        <section className="bg-white rounded-xl shadow max-w-3xl w-full p-8">
          <h1 className="text-2xl font-bold mb-4">{t('science.title')}</h1>
          <p className="text-gray-700">{t('science.intro')}</p>

          <h2 className="font-semibold mt-4">{t('science.sourceTitle')}</h2>
          <p className="text-gray-700">{t('science.sourceContent')}</p>

          <h2 className="font-semibold mt-4">{t('science.impactTitle')}</h2>
          <p className="text-gray-700">{t('science.impactContent')}</p>

          <h2 className="font-semibold mt-4">{t('science.protectTitle')}</h2>
        <ul className="list-disc pl-6 text-gray-700">
            <li>{t('science.protect1')}</li>
            <li>{t('science.protect2')}</li>
            <li>{t('science.protect3')}</li>
            <li>{t('science.protect4')}</li>
        </ul>

          <h2 className="font-semibold mt-4">{t('science.trendTitle')}</h2>
          <p className="text-gray-700">{t('science.trendContent')}</p>

          <h2 className="font-semibold mt-4">{t('science.policyTitle')}</h2>
          <p className="text-gray-700">{t('science.policyContent')}</p>

          <p className="text-gray-700 mt-8">{t('science.footer')}</p>
      </section>
    </main>
    </>
  );
} 