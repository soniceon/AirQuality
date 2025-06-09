import React, { useState, useEffect } from 'react';
import { Search, Wind, Thermometer, Droplets, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getUserLocation, getWeatherAndAirQuality } from '../utils/baiduApi';
import { Helmet } from 'react-helmet';
import { languageToCountry, hotCitiesByCountry } from '../constants/city';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [city, setCity] = useState('');
  const [airData, setAirData] = useState<AirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hotCities, setHotCities] = useState<string[]>(["newyork", "losangeles", "chicago", "houston", "phoenix", "philadelphia", "sanantonio", "sandiego"]);

  interface AirData {
    cityName: string;
    aqi: number;
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number | string;
    temp: number | undefined;
    humidity: number | undefined;
  }

  useEffect(() => {
    (async () => {
      try {
        const loc = await getUserLocation();
        if (loc && loc.city) {
          fetchAirQuality(loc.city, true);
        }
        if (loc && loc.country) {
          setHotCities(hotCitiesByCountry[loc.country] || ["newyork", "losangeles", "chicago", "houston", "phoenix", "philadelphia", "sanantonio", "sandiego"]);
        }
      } catch (e) {}
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const lang = i18n.language;
    const displayCountry = languageToCountry[lang] || 'United States';
    setHotCities(hotCitiesByCountry[displayCountry] || hotCitiesByCountry['United States']);
  }, [i18n.language]);

  const fetchAirQuality = async (inputCity?: string, isAuto?: boolean) => {
    const queryCity = typeof inputCity === 'string' ? inputCity : city;
    if (!queryCity.trim()) {
      setError(t('common.error') + ': ' + t('home.searchPlaceholder'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const realData = await getWeatherAndAirQuality(queryCity);
      setAirData({
        cityName: queryCity,
        aqi: realData.aqi ?? 0,
        pm25: realData.pm25 ?? 0,
        pm10: realData.pm10 ?? 0,
        o3: realData.o3 ?? 0,
        no2: realData.no2 ?? 0,
        so2: realData.so2 ?? 0,
        co: realData.co ?? 0,
        temp: realData.temp ?? undefined,
        humidity: realData.humidity ?? undefined
      });
      if (!isAuto) setCity(queryCity);
    } catch (e: any) {
      setError('获取真实空气质量数据失败: ' + (e.message || e.toString()));
    }
    setLoading(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchAirQuality();
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { level: t('aqiLevels.good'), color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle, i18nKey: 'aqiLevels.good' };
    if (aqi <= 100) return { level: t('aqiLevels.moderate'), color: 'text-yellow-600', bg: 'bg-yellow-100', icon: CheckCircle, i18nKey: 'aqiLevels.moderate' };
    if (aqi <= 150) return { level: t('aqiLevels.unhealthyForSensitive'), color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertTriangle, i18nKey: 'aqiLevels.unhealthyForSensitive' };
    if (aqi <= 200) return { level: t('aqiLevels.unhealthy'), color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle, i18nKey: 'aqiLevels.unhealthy' };
    if (aqi <= 300) return { level: t('aqiLevels.veryUnhealthy'), color: 'text-purple-600', bg: 'bg-purple-100', icon: XCircle, i18nKey: 'aqiLevels.veryUnhealthy' };
    return { level: t('aqiLevels.hazardous'), color: 'text-red-800', bg: 'bg-red-200', icon: XCircle, i18nKey: 'aqiLevels.hazardous' };
  };

  const aqiInfo = airData ? getAQILevel(airData.aqi) : null;

  return (
    <>
      <Helmet>
        <title>{t('home.seoTitle', t('home.title'))}</title>
        <meta name="description" content={t('home.seoDesc', t('home.subtitle'))} />
        <meta name="keywords" content={t('home.seoKeywords', 'air quality, AQI, PM2.5, global, city, pollution, weather')} />
        <meta property="og:title" content={t('home.seoTitle', t('home.title'))} />
        <meta property="og:description" content={t('home.seoDesc', t('home.subtitle'))} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="https://airquality.tools/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('home.seoTitle', t('home.title'))} />
        <meta name="twitter:description" content={t('home.seoDesc', t('home.subtitle'))} />
        <meta name="twitter:image" content="https://airquality.tools/og-image.png" />
        {/* hreflang 多语言链接 */}
        {Array.isArray(i18n.options.supportedLngs) && i18n.options.supportedLngs.filter((l: string) => l !== "cimode").map((l: string) => (
          <link rel="alternate" hrefLang={l} href={typeof window !== 'undefined' ? window.location.origin + (l === i18n.options.fallbackLng ? '/' : `/${l}`) : ''} key={l} />
        ))}
        {/* 结构化数据 WebSite */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": t('home.seoTitle', t('home.title')),
          "url": typeof window !== 'undefined' ? window.location.origin : '',
          "description": t('home.seoDesc', t('home.subtitle'))
        })}</script>
      </Helmet>
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Wind className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">{t('home.title', 'Air Quality 空气质量查询')}</h1>
            </div>
            <p className="text-gray-600">{t('home.subtitle', 'AirQuality.Tools 提供全球主要城市 air quality（空气质量）实时监测、AQI、PM2.5、PM10 等多项空气污染物数据，助您关注健康生活。')}</p>
          </div>
          <div className="mb-8">
            <div className="flex gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  placeholder=""
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? t('common.loading', '查询中...') : t('common.search', '查询')}
              </button>
            </div>
          </div>
          {error && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">{t('home.popularCities')}</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {hotCities.map((cityKey) => {
                const cityLabel = t(`home.cities.${cityKey}`, { defaultValue: cityKey });
                return (
                  <button
                    key={cityKey}
                    onClick={() => { setCity(cityKey); fetchAirQuality(cityKey); }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {cityLabel}
                  </button>
                );
              })}
            </div>
          </div>
          {airData && aqiInfo && (
            <div className={`p-6 rounded-xl ${aqiInfo.bg} border-l-4 border-l-blue-500`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {t(`home.cities.${airData?.cityName?.toLowerCase?.()}`, airData?.cityName)} {t('airQuality.aqi')}
                </h2>
                {aqiInfo.icon && <aqiInfo.icon className={`h-6 w-6 ${aqiInfo.color} mr-2`} />}
                <span className={`text-lg font-semibold ${aqiInfo.color}`}>{t(aqiInfo.i18nKey)}</span>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800 mb-2">{airData?.aqi ?? '--'}</div>
                <div className="text-gray-600">{t('airQuality.aqi')} (AQI)</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">PM2.5</span>
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.pm25}</div>
              <div className="text-xs text-gray-600">μg/m³</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">PM10</span>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.pm10}</div>
              <div className="text-xs text-gray-600">μg/m³</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">O₃</span>
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.o3}</div>
              <div className="text-xs text-gray-600">μg/m³</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">NO₂</span>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.no2}</div>
              <div className="text-xs text-gray-600">μg/m³</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">SO₂</span>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.so2}</div>
              <div className="text-xs text-gray-600">μg/m³</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">CO</span>
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.co}</div>
              <div className="text-xs text-gray-600">mg/m³</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Thermometer className="h-5 w-5 text-cyan-600 mr-2" />
                <span className="font-medium text-gray-700">{t('airQuality.temp', '温度')}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.temp ?? '--'}°C</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Droplets className="h-5 w-5 text-teal-600 mr-2" />
                <span className="font-medium text-gray-700">{t('airQuality.humidity', '湿度')}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{airData?.humidity ?? '--'}%</div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3">{t('airQuality.aqiDescTitle', '空气质量指数说明')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                <div className="font-semibold">0-50</div>
                <div>{t('aqiLevels.good')}</div>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center">
                <div className="font-semibold">51-100</div>
                <div>{t('aqiLevels.moderate')}</div>
              </div>
              <div className="bg-orange-100 text-orange-800 p-2 rounded text-center">
                <div className="font-semibold">101-150</div>
                <div>{t('aqiLevels.unhealthyForSensitive')}</div>
              </div>
              <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                <div className="font-semibold">151-200</div>
                <div>{t('aqiLevels.unhealthy')}</div>
              </div>
              <div className="bg-purple-100 text-purple-800 p-2 rounded text-center">
                <div className="font-semibold">201-300</div>
                <div>{t('aqiLevels.veryUnhealthy')}</div>
              </div>
              <div className="bg-red-200 text-red-900 p-2 rounded text-center">
                <div className="font-semibold">300+</div>
                <div>{t('aqiLevels.hazardous')}</div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            {/* 数据免责声明已去除 */}
          </div>
          {/* 常见问题区块 */}
          <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">{t('faq.title', 'Air Quality 常见问题')}</h2>
            <div>
              <h3 className="font-semibold mt-4">{t('faq.whatIsAQI.question')}</h3>
              <p className="text-gray-700">{t('faq.whatIsAQI.answer')}</p>
              <h3 className="font-semibold mt-4">{t('faq.whatIsPM25.question')}</h3>
              <p className="text-gray-700">{t('faq.whatIsPM25.answer')}</p>
              <h3 className="font-semibold mt-4">{t('faq.dataSource.question')}</h3>
              <p className="text-gray-700">{t('faq.dataSource.answer')}</p>
              <h3 className="font-semibold mt-4">{t('faq.howToQuery.question')}</h3>
              <p className="text-gray-700">{t('faq.howToQuery.answer')}</p>
              <h3 className="font-semibold mt-4">{t('faq.healthImpact.question')}</h3>
              <p className="text-gray-700">{t('faq.healthImpact.answer')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 