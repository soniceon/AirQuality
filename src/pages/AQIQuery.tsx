export default function AQIQuery() {
  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">空气质量查询</h1>
      <p className="text-gray-700 mb-4">输入城市名称即可查询该城市的实时空气质量指数（AQI）及主要污染物浓度。</p>
      <ul className="list-disc pl-6 text-gray-700">
        <li>支持全球主要城市</li>
        <li>数据来源权威，更新及时</li>
        <li>可查看PM2.5、PM10、O₃、NO₂、SO₂、CO等详细数据</li>
      </ul>
    </main>
  );
} 