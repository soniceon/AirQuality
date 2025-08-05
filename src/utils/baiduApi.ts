const BAIDU_AK = 'WQbX6sngyRMkmUw12j51alybbwPhOaur';
import i18n from '../i18n/config';
import { languageToCountry, hotCitiesByCountry } from '../constants/city';

// OpenWeather API Key
export const OPENWEATHER_API_KEY = '6ef808255f8a499a9b964f881b458039';

// 1. 获取用户IP定位信息
export async function getUserLocation() {
  try {
    const res = await fetch(`https://api.map.baidu.com/location/ip?ak=${BAIDU_AK}&coor=bd09ll`);
    const data = await res.json();
    if (data.status === 0) {
      return {
        city: data.content.address_detail.city.replace('市', ''),
        country: data.content.address_detail.province
      };
    }
    throw new Error(i18n.t('error.locationFailed'));
  } catch {
    // 兜底：语言->国家->热门城市->随机
    const lang = i18n.language || (typeof navigator !== 'undefined' ? navigator.language : 'en');
    const country = languageToCountry[lang] || 'United States';
    const hotCities = hotCitiesByCountry[country] || hotCitiesByCountry['United States'];
    const city = hotCities[Math.floor(Math.random() * hotCities.length)];
    return { city, country };
  }
}

// 2. 用城市名查行政区划代码（district_id）
export async function getDistrictId(city: string): Promise<string> {
  const res = await fetch(`https://api.map.baidu.com/geocoding/v3/?address=${encodeURIComponent(city)}&output=json&ak=${BAIDU_AK}`);
  const data = await res.json();
  if (data.status === 0 && data.result && data.result.cityCode) {
    // cityCode 不是标准district_id，需用result.adcode（新版API）
    return data.result.adcode || data.result.cityCode.toString();
  }
  throw new Error(i18n.t('error.districtCodeFailed'));
}

// 通过城市名获取经纬度
export async function getLatLonByCity(city: string) {
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`);
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
  }
  throw new Error(i18n.t('error.cityNotFound'));
}

// 通过经纬度获取空气质量
export async function getWeatherAndAirQuality(city: string) {
  const { lat, lon, name, country } = await getLatLonByCity(city);
  const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`);
  const airData = await airRes.json();
  let temp = null;
  let humidity = null;
  try {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
    const weatherData = await weatherRes.json();
    if (weatherData && weatherData.main) {
      temp = weatherData.main.temp;
      humidity = weatherData.main.humidity;
    }
  } catch (e) {}
  if (airData && airData.list && airData.list.length > 0) {
    const aqiData = airData.list[0];
    // OpenWeather AQI: 1~5, 需自定义映射
    const aqiMap = [0, 50, 100, 150, 200, 300];
    return {
      cityName: name,
      country,
      aqi: aqiMap[aqiData.main.aqi] || 0,
      pm25: aqiData.components.pm2_5,
      pm10: aqiData.components.pm10,
      o3: aqiData.components.o3,
      no2: aqiData.components.no2,
      so2: aqiData.components.so2,
      co: aqiData.components.co,
      temp,
      humidity
    };
  }
  throw new Error(i18n.t('error.airQualityFailed'));
} 