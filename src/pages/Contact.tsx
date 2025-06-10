import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

export default function Contact() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('contact.seoTitle')}</title>
        <meta name="description" content={t('contact.seoDesc')} />
        <meta name="keywords" content={t('contact.seoKeywords')} />
        <meta property="og:title" content={t('contact.seoTitle')} />
        <meta property="og:description" content={t('contact.seoDesc')} />
        <meta property="og:type" content="contactpage" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://airquality.tools/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('contact.seoTitle')} />
        <meta name="twitter:description" content={t('contact.seoDesc')} />
        <meta name="twitter:image" content="https://airquality.tools/og-image.png" />
        {Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs.filter((l: string) => l !== "cimode").map((l: string) => (
          <link rel="alternate" hrefLang={l} href={typeof window !== 'undefined' ? window.location.origin + (l === i18n.options.fallbackLng ? '/contact' : `/${l}/contact`) : ''} key={l} />
        ))}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": t('contact.seoTitle'),
          "description": t('contact.seoDesc'),
          "url": typeof window !== 'undefined' ? window.location.href : ''
        })}</script>
      </Helmet>
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{t('contact.title')}</h1>
      <p className="text-gray-700 mb-4">{t('contact.intro')}</p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>{t('contact.email')}: contact@airquality.tools</li>
        <li>{t('contact.wechat')}: AirQualityTools</li>
        <li>{t('contact.feedback')}</li>
      </ul>
        <p className="text-gray-700 mt-8">{t('contact.footer')}</p>
    </main>
    </>
  );
} 