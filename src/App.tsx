import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n/config';
import Navbar from './components/Navbar';
import AQIQuery from './pages/AQIQuery';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Science from './pages/Science';
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query" element={<AQIQuery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/science" element={<Science />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 