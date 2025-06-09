const fs = require('fs');
const path = require('path');

// 支持的语言列表
const supportedLanguages = {
  en: { name: 'English', nativeName: 'English' },
  'zh-CN': { name: '简体中文', nativeName: '简体中文' },
  'zh-TW': { name: '繁體中文', nativeName: '繁體中文' },
  ja: { name: '日本語', nativeName: '日本語' },
  ko: { name: '한국어', nativeName: '한국어' },
  es: { name: 'Español', nativeName: 'Español' },
  fr: { name: 'Français', nativeName: 'Français' },
  de: { name: 'Deutsch', nativeName: 'Deutsch' },
  ar: { name: 'العربية', nativeName: 'العربية' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
  ur: { name: 'Urdu', nativeName: 'اردو' },
  el: { name: 'Ελληνικά', nativeName: 'Ελληνικά' },
  tr: { name: 'Türkçe', nativeName: 'Türkçe' },
  ne: { name: 'नेपाली', nativeName: 'नेपाली' },
  bs: { name: 'Bosanski', nativeName: 'Bosanski' },
  sr: { name: 'Српски', nativeName: 'Српски' },
  hr: { name: 'Hrvatski', nativeName: 'Hrvatski' },
  ga: { name: 'Gaeilge', nativeName: 'Gaeilge' }
};

// 网站基础 URL
const BASE_URL = 'https://airquality.tools';

// 生成站点地图 XML 内容
function generateSitemapXML(urls) {
  const xmlUrls = urls.map(url => `
    <url>
      <loc>${url}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlUrls}
</urlset>`;
}

// 生成站点地图索引 XML
function generateSitemapIndex(sitemaps) {
  const xmlSitemaps = sitemaps.map(sitemap => `
    <sitemap>
      <loc>${sitemap}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${xmlSitemaps}
</sitemapindex>`;
}

// 主函数：生成所有站点地图
async function generateSitemaps() {
  const sitemapDir = path.join(__dirname, '../public/sitemaps');
  
  // 如果站点地图目录不存在，创建它
  if (!fs.existsSync(sitemapDir)) {
    fs.mkdirSync(sitemapDir, { recursive: true });
  }

  const sitemapUrls = [];
  
  // 为每种语言生成站点地图
  for (const [langCode] of Object.entries(supportedLanguages)) {
    const urls = [
      `${BASE_URL}/${langCode}/`,
      `${BASE_URL}/${langCode}/about`,
      `${BASE_URL}/${langCode}/contact`,
      `${BASE_URL}/${langCode}/faq`,
      `${BASE_URL}/${langCode}/science`
    ];

    const sitemapContent = generateSitemapXML(urls);
    const sitemapPath = path.join(sitemapDir, `sitemap-${langCode}.xml`);
    fs.writeFileSync(sitemapPath, sitemapContent);
    
    sitemapUrls.push(`${BASE_URL}/sitemaps/sitemap-${langCode}.xml`);
  }

  // 生成站点地图索引
  const sitemapIndexContent = generateSitemapIndex(sitemapUrls);
  fs.writeFileSync(path.join(sitemapDir, 'sitemap-index.xml'), sitemapIndexContent);

  console.log('站点地图生成成功！');
}

// 运行脚本
generateSitemaps().catch(console.error); 