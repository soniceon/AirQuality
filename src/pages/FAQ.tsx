import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <>
      <SEOHead 
        title={t('seo.faqTitle')}
        description={t('seo.faqDescription')}
        canonical="https://airquality.tools/faq"
        ogType="website"
      />
      <main className="flex justify-center items-start py-12 px-2 min-h-[60vh]">
        <section className="bg-white rounded-xl shadow max-w-3xl w-full p-8">
          <h1 className="text-2xl font-bold mb-4">{t('faq.title')}</h1>
          <p className="text-gray-700">{t('faq.intro')}</p>
          <div>
            <h3 className="font-semibold mt-4">{t('faq.whatIsAQI.question')}</h3>
            <p className="text-gray-700">{t('faq.whatIsAQI.answer')}</p>
            <h3 className="font-semibold mt-4">{t('faq.whatIsPM25.question')}</h3>
            <p className="text-gray-700">{t('faq.whatIsPM25.answer')}</p>
            <h3 className="font-semibold mt-4">{t('faq.dataSource.question')}</h3>
            <p className="text-gray-700">{t('faq.dataSource.answer')}</p>
            <h3 className="font-semibold mt-4">{t('faq.howToQuery.question')}</h3>
            <p className="text-gray-700">{t('faq.howToQuery.answer')}</p>
            <h3 className="font-semibold mt-4">{t('faq.healthImpact.question')}</h3>
            <p className="text-gray-700">{t('faq.healthImpact.answer')}</p>
          </div>
          <p className="text-gray-700 mt-8">{t('faq.footer')}</p>
        </section>
      </main>
    </>
  );
} 