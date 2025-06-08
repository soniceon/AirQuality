import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{t('contact.title')}</h1>
      <p className="text-gray-700 mb-4">{t('contact.intro')}</p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>{t('contact.email')}: contact@airquality.tools</li>
        <li>{t('contact.wechat')}: AirQualityTools</li>
        <li>{t('contact.feedback')}</li>
      </ul>
    </main>
  );
} 