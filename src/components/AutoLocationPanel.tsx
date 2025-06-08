import React, { useEffect, useState } from 'react';
import { getUserLocation, getDistrictId, getWeatherAndAirQuality } from '../utils/baiduApi';

const hotCitiesByCountry: Record<string, string[]> = {
  '中国': ['北京', '上海', '广州', '深圳'],
  '法国': ['巴黎', '里昂', '马赛'],
  '美国': ['New York', 'Los Angeles', 'Chicago'],
  // ...可扩展更多国家
};

const BAIDU_AK = 'WQbX6sngyRMkmUw12j51alybbwPhOaur';

const AutoLocationPanel: React.FC = () => {
  const [city, setCity] = useState('');
  // const [country, setCountry] = useState('');
  const [hotCities, setHotCities] = useState<string[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getUserLocation();
        setCity(loc.city);
        setHotCities(hotCitiesByCountry[loc.country] || ['New York', 'London', 'Tokyo']);
        const district_id = await getDistrictId(loc.city);
        const weatherData = await getWeatherAndAirQuality(district_id);
        setWeather(weatherData);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, []);

  // 用户手动切换城市
  const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    try {
      const district_id = await getDistrictId(newCity);
      const weatherData = await getWeatherAndAirQuality(district_id);
      setWeather(weatherData);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2>空气质量与天气</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <div>
        <label>城市：</label>
        <input value={city} onChange={handleCityChange} placeholder="请输入城市名" />
      </div>
      <div>
        <label>热门城市：</label>
        {hotCities.map(hc => (
          <button key={hc} onClick={() => handleCityChange({target: {value: hc}} as any)}>{hc}</button>
        ))}
      </div>
      <div style={{margin: '20px 0'}}>
        <h3>地图</h3>
        <div id="baidu-map" style={{width: '100%', height: 300}}></div>
        {/* 百度地图JS API脚本 */}
        <script src={`https://api.map.baidu.com/api?v=3.0&ak=${BAIDU_AK}`}></script>
      </div>
      {weather && (
        <div>
          <h3>当前天气</h3>
          <div>天气：{weather.now.text}</div>
          <div>温度：{weather.now.temp}℃</div>
          <div>空气质量：{weather.now.air_quality?.category} (AQI: {weather.now.air_quality?.aqi})</div>
          <div>PM2.5：{weather.now.air_quality?.pm2_5}</div>
          <div>PM10：{weather.now.air_quality?.pm10}</div>
        </div>
      )}
    </div>
  );
};

export default AutoLocationPanel; 