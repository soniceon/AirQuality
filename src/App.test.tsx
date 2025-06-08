import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the hooks and utilities
vi.mock('./hooks/useAirQualityCache', () => ({
  useAirQualityCache: (city: string) => ({
    data: city ? {
      cityName: city,
      aqi: 75,
      pm25: 35,
      pm10: 45,
      o3: 30,
      no2: 25,
      so2: 5,
      co: 0.5,
      temp: 20,
      humidity: 60,
      timestamp: Date.now()
    } : null,
    loading: false,
    error: null,
    refetch: vi.fn()
  })
}));

vi.mock('./utils/performance', () => ({
  performanceMonitor: {
    getMetrics: vi.fn(),
    logError: vi.fn()
  }
}));

describe('App Component', () => {
  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('AirQuality.Tools')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/输入城市名称/)).toBeInTheDocument();
  });

  it('renders popular cities', () => {
    render(<App />);
    expect(screen.getByText('北京')).toBeInTheDocument();
    expect(screen.getByText('上海')).toBeInTheDocument();
    expect(screen.getByText('东京')).toBeInTheDocument();
  });
}); 