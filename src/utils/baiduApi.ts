const BAIDU_AK = 'WQbX6sngyRMkmUw12j51alybbwPhOaur';

// 1. 获取用户IP定位信息
export async function getUserLocation() {
  // mock: 本地测试用，始终返回中国北京
  return { city: '北京', country: '中国' };
}

// 2. 用城市名查行政区划代码（district_id）
export async function getDistrictId(city: string): Promise<string> {
  const res = await fetch(`https://api.map.baidu.com/geocoding/v3/?address=${encodeURIComponent(city)}&output=json&ak=${BAIDU_AK}`);
  const data = await res.json();
  if (data.status === 0 && data.result && data.result.cityCode) {
    // cityCode 不是标准district_id，需用result.adcode（新版API）
    return data.result.adcode || data.result.cityCode.toString();
  }
  throw new Error('获取行政区划代码失败');
}

// 3. 用district_id查天气和空气质量
export async function getWeatherAndAirQuality(district_id: string) {
  const res = await fetch(`https://api.map.baidu.com/weather/v1/?district_id=${district_id}&data_type=all&ak=${BAIDU_AK}`);
  const data = await res.json();
  if (data.status === 0) {
    return data.result; // {location, now, forecasts, ...}
  }
  throw new Error('天气/空气质量查询失败');
} 