import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://airquality.tools/og-image.jpg',
  ogType = 'website'
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // 直接获取翻译内容，确保语言变化时更新
  const defaultTitle = t('seo.defaultTitle', '空气质量指数(AQI)查询 - 全球城市实时空气质量监测 | AirQuality.Tools');
  const defaultDescription = t('seo.defaultDescription', 'AirQuality.Tools提供全球主要城市的实时空气质量指数(AQI)监测数据，支持北京、上海、广州、深圳、纽约、伦敦、巴黎等100+城市查询，助您关注健康生活。PM2.5、PM10、臭氧等污染物实时监测。');
  const defaultKeywords = t('seo.defaultKeywords', '空气质量, AQI, 实时监测, 全球城市, 环境, 健康, PM2.5, PM10, 空气污染, 天气');

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalCanonical = canonical || 'https://airquality.tools/';

  return (
    <Helmet>
      {/* 基础Meta标签 */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalCanonical} />
      
      {/* AI友好的robots标签 */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="slurp" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* 语言设置 */}
      <html lang={currentLang} />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={t('seo.ogImageAlt', 'AirQuality.Tools - 全球城市空气质量监测')} />
      <meta property="og:locale" content={currentLang} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@airqualitytools" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* 多语言hreflang */}
      <link rel="alternate" hrefLang="en" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="zh-CN" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="zh-TW" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="ja" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="ko" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="es" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="fr" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="de" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="ar" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="hi" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="km" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="ur" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="el" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="tr" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="ne" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="bs" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="sr" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="hr" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="ga" href="https://airquality.tools/" />
      <link rel="alternate" hrefLang="x-default" href="https://airquality.tools/" />
    </Helmet>
  );
};

export default SEOHead; 