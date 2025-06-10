export default function AQIQuery() {
  const { t } = require('react-i18next').useTranslation();
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{t('aqiQuery.title')}</h1>
      <p className="text-gray-700 mb-4">{t('aqiQuery.intro')}</p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>{t('aqiQuery.feature1')}</li>
        <li>{t('aqiQuery.feature2')}</li>
        <li>{t('aqiQuery.feature3')}</li>
      </ul>
      <p className="text-gray-700 mt-8">{t('aqiQuery.footer')}</p>
    </main>
  );
} 