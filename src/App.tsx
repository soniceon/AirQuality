import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
// 懒加载页面组件
const AQIQuery = lazy(() => import('./pages/AQIQuery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Science = lazy(() => import('./pages/Science'));
import Home from './pages/Home';
import { performanceMonitor } from './utils/performance';

const App: React.FC = () => {
  const { } = useTranslation();

  // 性能监控
  useEffect(() => {
    try {
      performanceMonitor.getMetrics();
    } catch (err) {
      performanceMonitor.logError(err as Error);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/query" element={<AQIQuery />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/science" element={<Science />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App; 