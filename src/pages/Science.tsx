import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function Science() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('science.seoTitle')}</title>
        <meta name="description" content={t('science.seoDesc')} />
        <meta name="keywords" content={t('science.seoKeywords')} />
        <meta property="og:title" content={t('science.seoTitle')} />
        <meta property="og:description" content={t('science.seoDesc')} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://airquality.tools/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('science.seoTitle')} />
        <meta name="twitter:description" content={t('science.seoDesc')} />
        <meta name="twitter:image" content="https://airquality.tools/og-image.png" />
        {Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs.filter((l: string) => l !== "cimode").map((l: string) => (
          <link rel="alternate" hrefLang={l} href={typeof window !== 'undefined' ? window.location.origin + (l === i18n.options.fallbackLng ? '/science' : `/${l}/science`) : ''} key={l} />
        ))}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": t('science.seoTitle'),
          "description": t('science.seoDesc'),
          "url": typeof window !== 'undefined' ? window.location.href : ''
        })}</script>
      </Helmet>
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