import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function About() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('about.seoTitle', t('about.title'))}</title>
        <meta name="description" content={t('about.seoDesc', t('about.description'))} />
        <meta name="keywords" content={t('about.seoKeywords', 'about, air quality, team, contact, AQI')} />
        <meta property="og:title" content={t('about.seoTitle', t('about.title'))} />
        <meta property="og:description" content={t('about.seoDesc', t('about.description'))} />
        <meta property="og:type" content="aboutpage" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://airquality.tools/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('about.seoTitle', t('about.title'))} />
        <meta name="twitter:description" content={t('about.seoDesc', t('about.description'))} />
        <meta name="twitter:image" content="https://airquality.tools/og-image.png" />
        {Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs.filter((l: string) => l !== "cimode").map((l: string) => (
          <link rel="alternate" hrefLang={l} href={typeof window !== 'undefined' ? window.location.origin + (l === i18n.options.fallbackLng ? '/about' : `/${l}/about`) : ''} key={l} />
        ))}
        {/* 结构化数据 AboutPage */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": t('about.seoTitle', t('about.title')),
          "description": t('about.seoDesc', t('about.description')),
          "url": typeof window !== 'undefined' ? window.location.href : ''
        })}</script>
      </Helmet>
      <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-gray-700 mb-4">{t('about.description')}</p>
        <p className="text-gray-700">{t('about.team')}</p>
      </main>
    </>
  );
} 