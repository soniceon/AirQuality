import React, { useState, useEffect } from 'react';
import { Search, Wind, Thermometer, Droplets, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getUserLocation } from '../utils/baiduApi';

const mockData: Record<string, { aqi: number; pm25: number; pm10: number; o3: number; no2: number; so2: number; co: number | string; temp: number; humidity: number }> = {
  '北京': { aqi: 125, pm25: 85, pm10: 95, o3: 45, no2: 35, so2: 12, co: 0.8, temp: 22, humidity: 65 },
  '上海': { aqi: 95, pm25: 65, pm10: 75, o3: 50, no2: 30, so2: 8, co: 0.6, temp: 25, humidity: 70 },
  '广州': { aqi: 85, pm25: 55, pm10: 65, o3: 60, no2: 25, so2: 6, co: 0.5, temp: 28, humidity: 75 },
  '深圳': { aqi: 80, pm25: 50, pm10: 60, o3: 55, no2: 20, so2: 5, co: 0.4, temp: 27, humidity: 72 },
  '东京': { aqi: 65, pm25: 35, pm10: 45, o3: 40, no2: 25, so2: 4, co: 0.3, temp: 20, humidity: 60 },
  '纽约': { aqi: 75, pm25: 45, pm10: 55, o3: 35, no2: 30, so2: 7, co: 0.5, temp: 18, humidity: 55 },
  '伦敦': { aqi: 70, pm25: 40, pm10: 50, o3: 30, no2: 35, so2: 8, co: 0.4, temp: 15, humidity: 80 },
  '巴黎': { aqi: 90, pm25: 60, pm10: 70, o3: 45, no2: 40, so2: 10, co: 0.6, temp: 17, humidity: 65 }
};

const getAQILevel = (aqi: number) => {
  if (aqi <= 50) return { level: '优', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
  if (aqi <= 100) return { level: '良', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: CheckCircle };
  if (aqi <= 150) return { level: '轻度污染', color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertTriangle };
  if (aqi <= 200) return { level: '中度污染', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
  if (aqi <= 300) return { level: '重度污染', color: 'text-purple-600', bg: 'bg-purple-100', icon: XCircle };
  return { level: '严重污染', color: 'text-red-800', bg: 'bg-red-200', icon: XCircle };
};

interface AirData {
  cityName: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number | string;
  temp: number;
  humidity: number;
}

const languageToCountry: Record<string, string> = {
  'zh-CN': '中国',
  'zh-TW': '中国',
  'en': 'United States',
  'ja': 'Japan',
  'fr': 'France',
  'de': 'Germany',
  'es': 'Spain',
  'ar': 'Egypt',
  'hi': 'India',
  'km': 'Cambodia',
  'ur': 'Pakistan',
  'el': 'Greece',
  'tr': 'Turkey',
  'ne': 'Nepal',
  'bs': 'Bosnia and Herzegovina',
  'sr': 'Serbia',
  'hr': 'Croatia',
  'ga': 'Ireland',
};

const hotCitiesByCountry: Record<string, string[]> = {
  '中国': ['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'chongqing', 'hangzhou', 'xian'],
  'China': ['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'chongqing', 'hangzhou', 'xian'],
  'United States': ['newyork', 'losangeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'sanantonio', 'sandiego'],
  '美国': ['newyork', 'losangeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'sanantonio', 'sandiego'],
  'United Kingdom': ['london', 'manchester', 'birmingham', 'liverpool', 'leeds', 'glasgow', 'sheffield', 'bristol'],
  '英国': ['london', 'manchester', 'birmingham', 'liverpool', 'leeds', 'glasgow', 'sheffield', 'bristol'],
  'France': ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier'],
  '法国': ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier'],
  'Egypt': ['cairo', 'alexandria', 'giza', 'shubra', 'portsaid', 'suez', 'luxor', 'asyut'],
  '埃及': ['cairo', 'alexandria', 'giza', 'shubra', 'portsaid', 'suez', 'luxor', 'asyut'],
  'Saudi Arabia': ['riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar', 'tabuk', 'abha'],
  '沙特阿拉伯': ['riyadh', 'jeddah', 'mecca', 'medina', 'dammam', 'khobar', 'tabuk', 'abha'],
  'India': ['delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 'pune', 'ahmedabad'],
  '印度': ['delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad', 'pune', 'ahmedabad'],
  'Cambodia': ['phnompenh', 'siemreap', 'battambang', 'sihanoukville', 'kampongcham', 'kampot', 'takhmau', 'poipet'],
  '柬埔寨': ['phnompenh', 'siemreap', 'battambang', 'sihanoukville', 'kampongcham', 'kampot', 'takhmau', 'poipet'],
  'Pakistan': ['karachi', 'lahore', 'faisalabad', 'rawalpindi', 'multan', 'hyderabadpk', 'gujranwala', 'peshawar'],
  '巴基斯坦': ['karachi', 'lahore', 'faisalabad', 'rawalpindi', 'multan', 'hyderabadpk', 'gujranwala', 'peshawar'],
  'Greece': ['athens', 'thessaloniki', 'patras', 'heraklion', 'larissa', 'volos', 'ioannina', 'chania'],
  '希腊': ['athens', 'thessaloniki', 'patras', 'heraklion', 'larissa', 'volos', 'ioannina', 'chania'],
  'Turkey': ['istanbul', 'ankara', 'izmir', 'bursa', 'adana', 'gaziantep', 'konya', 'antalya'],
  '土耳其': ['istanbul', 'ankara', 'izmir', 'bursa', 'adana', 'gaziantep', 'konya', 'antalya'],
  'Nepal': ['kathmandu', 'pokhara', 'lalitpur', 'bharatpur', 'biratnagar', 'birgunj', 'dharan', 'bhaktapur'],
  '尼泊尔': ['kathmandu', 'pokhara', 'lalitpur', 'bharatpur', 'biratnagar', 'birgunj', 'dharan', 'bhaktapur'],
  'Bosnia and Herzegovina': ['sarajevo', 'banjaluka', 'tuzla', 'zenica', 'mostar', 'bijeljina', 'prijedor', 'brcko'],
  '波黑': ['sarajevo', 'banjaluka', 'tuzla', 'zenica', 'mostar', 'bijeljina', 'prijedor', 'brcko'],
  'Serbia': ['belgrade', 'novisad', 'nis', 'kragujevac', 'subotica', 'zrenjanin', 'pancevo', 'cacak'],
  '塞尔维亚': ['belgrade', 'novisad', 'nis', 'kragujevac', 'subotica', 'zrenjanin', 'pancevo', 'cacak'],
  'Croatia': ['zagreb', 'split', 'rijeka', 'osijek', 'zadar', 'slavonskibrod', 'pula', 'karlovac'],
  '克罗地亚': ['zagreb', 'split', 'rijeka', 'osijek', 'zadar', 'slavonskibrod', 'pula', 'karlovac'],
  'Ireland': ['dublin', 'cork', 'limerick', 'galway', 'waterford', 'drogheda', 'dundalk', 'swords'],
  '爱尔兰': ['dublin', 'cork', 'limerick', 'galway', 'waterford', 'drogheda', 'dundalk', 'swords'],
  'Japan': ['tokyo', 'osaka', 'yokohama', 'nagoya', 'sapporo', 'fukuoka', 'kobe', 'kyoto'],
  '日本': ['tokyo', 'osaka', 'yokohama', 'nagoya', 'sapporo', 'fukuoka', 'kobe', 'kyoto'],
  'Germany': ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'stuttgart', 'dusseldorf', 'dortmund'],
  '德国': ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'stuttgart', 'dusseldorf', 'dortmund'],
  'Spain': ['madrid', 'barcelona', 'valencia', 'seville', 'zaragoza', 'malaga', 'murcia', 'palma'],
  '西班牙': ['madrid', 'barcelona', 'valencia', 'seville', 'zaragoza', 'malaga', 'murcia', 'palma'],
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [city, setCity] = useState('');
  const [airData, setAirData] = useState<AirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('');
  const [hotCities, setHotCities] = useState<string[]>(["newyork", "losangeles", "chicago", "houston", "phoenix", "philadelphia", "sanantonio", "sandiego"]);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getUserLocation();
        if (loc && loc.city) {
          setCity(loc.city);
          fetchAirQuality(loc.city);
        }
        if (loc && loc.country) {
          setCountry(loc.country);
          setHotCities(hotCitiesByCountry[loc.country] || ["newyork", "losangeles", "chicago", "houston", "phoenix", "philadelphia", "sanantonio", "sandiego"]);
        }
      } catch (e) {}
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let displayCountry = country;
    if (!displayCountry) {
      displayCountry = languageToCountry[i18n.language] || 'United States';
    }
    setHotCities(hotCitiesByCountry[displayCountry] || hotCitiesByCountry['United States']);
  }, [i18n.language, country]);

  const fetchAirQuality = async (inputCity?: string) => {
    const queryCity = typeof inputCity === 'string' ? inputCity : city;
    if (!queryCity.trim()) {
      setError(t('common.error') + ': ' + t('home.searchPlaceholder'));
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 800));
    const cityKey = Object.keys(mockData).find(key =>
      key.toLowerCase().includes(queryCity.toLowerCase()) ||
      queryCity.toLowerCase().includes(key.toLowerCase())
    );
    if (cityKey) {
      setAirData({ ...mockData[cityKey], cityName: cityKey });
    } else {
      const randomAQI = Math.floor(Math.random() * 200) + 20;
      setAirData({
        cityName: queryCity,
        aqi: randomAQI,
        pm25: Math.floor(Math.random() * 100) + 10,
        pm10: Math.floor(Math.random() * 120) + 15,
        o3: Math.floor(Math.random() * 80) + 20,
        no2: Math.floor(Math.random() * 60) + 10,
        so2: Math.floor(Math.random() * 20) + 2,
        co: (Math.random() * 2 + 0.1).toFixed(1),
        temp: Math.floor(Math.random() * 30) + 5,
        humidity: Math.floor(Math.random() * 40) + 40
      });
    }
    setLoading(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchAirQuality();
  };

  const aqiInfo = airData ? getAQILevel(airData.aqi) : null;
  const IconComponent = aqiInfo?.icon;

  return (
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
                placeholder={t('home.searchPlaceholder', '输入城市名称（如：北京、东京、纽约）')}
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
            {hotCities.map((cityKey) => (
              <button
                key={cityKey}
                onClick={() => { setCity(t(`home.cities.${cityKey}`)); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {t(`home.cities.${cityKey}`)}
              </button>
            ))}
          </div>
        </div>
        {airData && (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${aqiInfo?.bg} border-l-4 border-l-blue-500`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {airData.cityName} 空气质量
                </h2>
                <div className="flex items-center">
                  {IconComponent && <IconComponent className={`h-6 w-6 ${aqiInfo?.color} mr-2`} />}
                  <span className={`text-lg font-semibold ${aqiInfo?.color}`}>{aqiInfo?.level}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800 mb-2">{airData.aqi}</div>
                <div className="text-gray-600">空气质量指数 (AQI)</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">PM2.5</span>
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.pm25}</div>
                <div className="text-xs text-gray-600">μg/m³</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">PM10</span>
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.pm10}</div>
                <div className="text-xs text-gray-600">μg/m³</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">O₃</span>
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.o3}</div>
                <div className="text-xs text-gray-600">μg/m³</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">NO₂</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.no2}</div>
                <div className="text-xs text-gray-600">μg/m³</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">SO₂</span>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.so2}</div>
                <div className="text-xs text-gray-600">μg/m³</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">CO</span>
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.co}</div>
                <div className="text-xs text-gray-600">mg/m³</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <Thermometer className="h-5 w-5 text-cyan-600 mr-2" />
                  <span className="font-medium text-gray-700">温度</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.temp}°C</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <Droplets className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="font-medium text-gray-700">湿度</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{airData.humidity}%</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">空气质量指数说明</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                  <div className="font-semibold">0-50</div>
                  <div>优</div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center">
                  <div className="font-semibold">51-100</div>
                  <div>良</div>
                </div>
                <div className="bg-orange-100 text-orange-800 p-2 rounded text-center">
                  <div className="font-semibold">101-150</div>
                  <div>轻度污染</div>
                </div>
                <div className="bg-red-100 text-red-800 p-2 rounded text-center">
                  <div className="font-semibold">151-200</div>
                  <div>中度污染</div>
                </div>
                <div className="bg-purple-100 text-purple-800 p-2 rounded text-center">
                  <div className="font-semibold">201-300</div>
                  <div>重度污染</div>
                </div>
                <div className="bg-red-200 text-red-900 p-2 rounded text-center">
                  <div className="font-semibold">300+</div>
                  <div>严重污染</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>{t('home.dataDisclaimer')}</p>
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
            <div className="text-gray-500 text-xs mt-6">
              {t('home.dataDisclaimer')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 