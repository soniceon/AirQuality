import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import LanguageSwitcher from './components/LanguageSwitcher';
import './styles/LanguageSwitcher.css';
import Navbar from './components/Navbar';
import AQIQuery from './pages/AQIQuery';
import Science from './pages/Science';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { useAirQualityCache } from './hooks/useAirQualityCache';
import { performanceMonitor } from './utils/performance';
import { Search, Wind, Eye, Thermometer, Droplets, AlertTriangle, CheckCircle, XCircle, LucideIcon } from 'lucide-react';
import AutoLocationPanel from './components/AutoLocationPanel';
import Home from './pages/Home';

interface AQILevel {
  level: string;
  color: string;
  bg: string;
  icon: LucideIcon;
}

const RTL_LANGS = ['ar', 'ur', 'he', 'fa'];

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [city, setCity] = React.useState('');
  const { data: airData, loading, error, refetch } = useAirQualityCache(city);

  // 性能监控
  React.useEffect(() => {
    try {
      performanceMonitor.getMetrics();
    } catch (err) {
      performanceMonitor.logError(err as Error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = RTL_LANGS.includes(i18n.language) ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // 空气质量等级定义
  const getAQILevel = (aqi: number): AQILevel => {
    if (aqi <= 50) return { level: '优', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    if (aqi <= 100) return { level: '良', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: CheckCircle };
    if (aqi <= 150) return { level: '轻度污染', color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertTriangle };
    if (aqi <= 200) return { level: '中度污染', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    if (aqi <= 300) return { level: '重度污染', color: 'text-purple-600', bg: 'bg-purple-100', icon: XCircle };
    return { level: '严重污染', color: 'text-red-800', bg: 'bg-red-200', icon: XCircle };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      refetch();
    }
  };

  const aqiInfo = airData ? getAQILevel(airData.aqi) : null;

  return (
    <Router>
      <div className={`app min-h-screen flex flex-col`} dir={RTL_LANGS.includes(i18n.language) ? 'rtl' : 'ltr'}>
        <header>
          <Navbar />
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/air-quality" element={<AQIQuery />} />
            <Route path="/science" element={<Science />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="w-full text-center text-gray-400 text-sm py-8">
          &copy; {new Date().getFullYear()} AirQuality.Tools
        </footer>
      </div>
    </Router>
  );
};

export default App; 