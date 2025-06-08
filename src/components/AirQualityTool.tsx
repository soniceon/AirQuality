import React, { useState } from 'react';
import { Search, Wind, Eye, Thermometer, Droplets, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface AirData {
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
}

const AirQualityTool: React.FC = () => {
  const [city, setCity] = useState('');
  const [airData, setAirData] = useState<AirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 空气质量等级定义
  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return { level: '优', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    if (aqi <= 100) return { level: '良', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: CheckCircle };
    if (aqi <= 150) return { level: '轻度污染', color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertTriangle };
    if (aqi <= 200) return { level: '中度污染', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle };
    if (aqi <= 300) return { level: '重度污染', color: 'text-purple-600', bg: 'bg-purple-100', icon: XCircle };
    return { level: '严重污染', color: 'text-red-800', bg: 'bg-red-200', icon: XCircle };
  };

  // 获取空气质量数据
  const fetchAirQuality = async () => {
    if (!city.trim()) {
      setError('请输入城市名称');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // 使用免费的OpenWeatherMap空气污染API
      const API_KEY = process.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
      
      // 模拟数据，因为在这个环境中无法进行实际API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟不同城市的空气质量数据
      const mockData: Record<string, AirData> = {
        '北京': { cityName: '北京', aqi: 125, pm25: 85, pm10: 95, o3: 45, no2: 35, so2: 12, co: 0.8, temp: 22, humidity: 65 },
        '上海': { cityName: '上海', aqi: 95, pm25: 65, pm10: 75, o3: 50, no2: 30, so2: 8, co: 0.6, temp: 25, humidity: 70 },
        '广州': { cityName: '广州', aqi: 85, pm25: 55, pm10: 65, o3: 60, no2: 25, so2: 6, co: 0.5, temp: 28, humidity: 75 },
        '深圳': { cityName: '深圳', aqi: 80, pm25: 50, pm10: 60, o3: 55, no2: 20, so2: 5, co: 0.4, temp: 27, humidity: 72 },
        '东京': { cityName: '东京', aqi: 65, pm25: 35, pm10: 45, o3: 40, no2: 25, so2: 4, co: 0.3, temp: 20, humidity: 60 },
        '纽约': { cityName: '纽约', aqi: 75, pm25: 45, pm10: 55, o3: 35, no2: 30, so2: 7, co: 0.5, temp: 18, humidity: 55 },
        '伦敦': { cityName: '伦敦', aqi: 70, pm25: 40, pm10: 50, o3: 30, no2: 35, so2: 8, co: 0.4, temp: 15, humidity: 80 },
        '巴黎': { cityName: '巴黎', aqi: 90, pm25: 60, pm10: 70, o3: 45, no2: 40, so2: 10, co: 0.6, temp: 17, humidity: 65 }
      };
      
      const cityKey = Object.keys(mockData).find(key => 
        key.toLowerCase().includes(city.toLowerCase()) || 
        city.toLowerCase().includes(key.toLowerCase())
      );
      
      if (cityKey) {
        setAirData(mockData[cityKey]);
      } else {
        // 生成随机数据用于演示
        const randomAQI = Math.floor(Math.random() * 200) + 20;
        setAirData({
          cityName: city,
          aqi: randomAQI,
          pm25: Math.floor(Math.random() * 100) + 10,
          pm10: Math.floor(Math.random() * 120) + 15,
          o3: Math.floor(Math.random() * 80) + 20,
          no2: Math.floor(Math.random() * 60) + 10,
          so2: Math.floor(Math.random() * 20) + 2,
          co: Number((Math.random() * 2 + 0.1).toFixed(1)),
          temp: Math.floor(Math.random() * 30) + 5,
          humidity: Math.floor(Math.random() * 40) + 40
        });
      }
    } catch (err) {
      setError('获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
            <h1 className="text-3xl font-bold text-gray-800">空气质量查询</h1>
          </div>
          <p className="text-gray-600">实时监测全球城市空气质量状况</p>
        </div>

        {/* 搜索界面 */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="输入城市名称（如：北京、东京、纽约）"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? '查询中...' : '查询'}
            </button>
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* 快速选择城市 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">热门城市</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {['北京', '上海', '广州', '深圳', '东京', '纽约', '伦敦', '巴黎'].map((cityName) => (
              <button
                key={cityName}
                onClick={() => { setCity(cityName); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>

        {/* 空气质量数据显示 */}
        {airData && aqiInfo && (
          <div className="space-y-6">
            {/* 总体状况 */}
            <div className={`p-6 rounded-xl ${aqiInfo.bg} border-l-4 border-l-blue-500`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {airData.cityName} 空气质量
                </h2>
                <div className="flex items-center">
                  <IconComponent className={`h-6 w-6 ${aqiInfo.color} mr-2`} />
                  <span className={`text-lg font-semibold ${aqiInfo.color}`}>
                    {aqiInfo.level}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-800 mb-2">
                  {airData.aqi}
                </div>
                <div className="text-gray-600">空气质量指数 (AQI)</div>
              </div>
            </div>

            {/* 详细污染物数据 */}
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

            {/* 气象信息 */}
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

            {/* AQI 说明 */}
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

        {/* 使用说明 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>数据仅供参考 | 实际使用需要配置真实的空气质量API</p>
        </div>
      </div>
    </div>
  );
};

export default AirQualityTool; 