import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">{t('about.title')}</h1>
      <p className="text-gray-700 mb-4">{t('about.description')}</p>
      <p className="text-gray-700">{t('about.team')}</p>
    </main>
  );
} 