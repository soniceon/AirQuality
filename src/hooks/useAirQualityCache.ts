import { useState, useEffect } from 'react';

interface AirQualityData {
  cityName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  temp: number;
  humidity: number;
  timestamp: number;
}

const CACHE_DURATION = 30 * 60 * 1000; // 30分钟缓存
const CACHE_KEY = 'air_quality_cache';

export const useAirQualityCache = (city: string) => {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = (cityName: string): AirQualityData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cache = JSON.parse(cached);
      const cityData = cache[cityName];

      if (!cityData) return null;

      // 检查缓存是否过期
      if (Date.now() - cityData.timestamp > CACHE_DURATION) {
        return null;
      }

      return cityData;
    } catch {
      return null;
    }
  };

  const setCachedData = (cityName: string, data: Omit<AirQualityData, 'timestamp'>) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const cache = cached ? JSON.parse(cached) : {};
      
      cache[cityName] = {
        ...data,
        timestamp: Date.now()
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('缓存数据失败:', error);
    }
  };

  const fetchData = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      // 先检查缓存
      const cachedData = getCachedData(city);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // 如果没有缓存或缓存过期，则获取新数据
      // 这里使用模拟数据，实际项目中应该调用API
      const mockData = {
        cityName: city,
        aqi: Math.floor(Math.random() * 200) + 20,
        pm25: Math.floor(Math.random() * 100) + 10,
        pm10: Math.floor(Math.random() * 120) + 15,
        o3: Math.floor(Math.random() * 80) + 20,
        no2: Math.floor(Math.random() * 60) + 10,
        so2: Math.floor(Math.random() * 20) + 2,
        co: Number((Math.random() * 2 + 0.1).toFixed(1)),
        temp: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40
      };

      // 缓存新数据
      setCachedData(city, mockData);
      setData({ ...mockData, timestamp: Date.now() });
    } catch (err) {
      setError('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  return { data, loading, error, refetch: fetchData };
}; 