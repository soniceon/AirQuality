import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function FAQ() {
  const { t, i18n } = useTranslation();
  // 假设有 questions 数据
  const questions = [
    {
      question: t('faq.whatIsAQI.question'),
      answer: t('faq.whatIsAQI.answer')
    },
    {
      question: t('faq.whatIsPM25.question'),
      answer: t('faq.whatIsPM25.answer')
    }
  ];
  return (
    <>
      <Helmet>
        <title>{t('faq.seoTitle')}</title>
        <meta name="description" content={t('faq.seoDesc')} />
        <meta name="keywords" content={t('faq.seoKeywords')} />
        <meta property="og:title" content={t('faq.seoTitle')} />
        <meta property="og:description" content={t('faq.seoDesc')} />
        <meta property="og:type" content="faqpage" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://airquality.tools/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('faq.seoTitle')} />
        <meta name="twitter:description" content={t('faq.seoDesc')} />
        <meta name="twitter:image" content="https://airquality.tools/og-image.png" />
        {Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs.filter((l: string) => l !== "cimode").map((l: string) => (
          <link rel="alternate" hrefLang={l} href={typeof window !== 'undefined' ? window.location.origin + (l === i18n.options.fallbackLng ? '/faq' : `/${l}/faq`) : ''} key={l} />
        ))}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": questions.map(q => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          })),
          "url": typeof window !== 'undefined' ? window.location.href : ''
        })}</script>
      </Helmet>
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