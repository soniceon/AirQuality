import { useTranslation } from 'react-i18next';
// @ts-expect-error: no type declaration for react-helmet
import { Helmet } from 'react-helmet';

export default function FAQ() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "${t('faq.whatIsAQI.question')}",
                "acceptedAnswer": { "@type": "Answer", "text": "${t('faq.whatIsAQI.answer')}" }
              },
              {
                "@type": "Question",
                "name": "${t('faq.whatIsPM25.question')}",
                "acceptedAnswer": { "@type": "Answer", "text": "${t('faq.whatIsPM25.answer')}" }
              },
              {
                "@type": "Question",
                "name": "${t('faq.dataSource.question')}",
                "acceptedAnswer": { "@type": "Answer", "text": "${t('faq.dataSource.answer')}" }
              },
              {
                "@type": "Question",
                "name": "${t('faq.howToQuery.question')}",
                "acceptedAnswer": { "@type": "Answer", "text": "${t('faq.howToQuery.answer')}" }
              },
              {
                "@type": "Question",
                "name": "${t('faq.healthImpact.question')}",
                "acceptedAnswer": { "@type": "Answer", "text": "${t('faq.healthImpact.answer')}" }
              }
            ]
          }
        `}</script>
      </Helmet>
      <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">{t('faq.title')}</h1>
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
          <div className="text-gray-500 text-xs mt-6">
            {t('home.dataDisclaimer')}
          </div>
        </div>
      </main>
    </>
  );
} 