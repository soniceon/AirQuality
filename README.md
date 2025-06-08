# 国际化 (i18n) 实现指南

## 概述

本文档提供了完整的国际化 (Internationalization, i18n) 实现方案，支持根据用户的浏览器语言、地理位置或用户偏好自动切换界面语言。

## 技术栈选择

### React 应用推荐方案
- **react-i18next**: React 最流行的国际化库
- **i18next**: 核心国际化框架
- **i18next-browser-languagedetector**: 自动语言检测
- **i18next-http-backend**: 动态加载翻译文件

### Vue 应用推荐方案
- **Vue I18n**: Vue 官方国际化插件
- **vue-i18n-next**: Vue 3 版本

### 通用解决方案
- **Intl API**: 浏览器原生国际化支持
- **FormatJS**: 企业级国际化解决方案

## 快速开始

### 1. 安装依赖

```bash
# React 项目
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend

# Vue 项目
npm install vue-i18n

# 通用工具
npm install @formatjs/intl @formatjs/intl-pluralrules
```

### 2. 项目结构

```
src/
├── i18n/
│   ├── index.js                 # i18n 配置文件
│   ├── detector.js              # 语言检测配置
│   └── resources/               # 翻译资源文件
│       ├── en/
│       │   ├── common.json      # 通用翻译
│       │   ├── components.json  # 组件翻译
│       │   └── pages.json       # 页面翻译
│       ├── zh-CN/
│       │   ├── common.json
│       │   ├── components.json
│       │   └── pages.json
│       ├── zh-TW/
│       ├── ja/
│       ├── ko/
│       ├── es/
│       ├── fr/
│       ├── de/
│       └── ar/
├── components/
│   ├── LanguageSwitcher.jsx     # 语言切换组件
│   └── LocalizedComponent.jsx   # 本地化组件示例
├── hooks/
│   └── useLocalization.js       # 本地化 Hook
└── utils/
    ├── dateFormat.js            # 日期格式化
    ├── numberFormat.js          # 数字格式化
    └── currencyFormat.js        # 货币格式化
```

### 3. React i18next 配置

```javascript
// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 支持的语言列表
export const supportedLanguages = {
  'en': { name: 'English', flag: '🇺🇸' },
  'zh-CN': { name: '简体中文', flag: '🇨🇳' },
  'zh-TW': { name: '繁體中文', flag: '🇹🇼' },
  'ja': { name: '日本語', flag: '🇯🇵' },
  'ko': { name: '한국어', flag: '🇰🇷' },
  'es': { name: 'Español', flag: '🇪🇸' },
  'fr': { name: 'Français', flag: '🇫🇷' },
  'de': { name: 'Deutsch', flag: '🇩🇪' },
  'ar': { name: 'العربية', flag: '🇸🇦' }
};

// 语言检测配置
const detectionOptions = {
  order: [
    'querystring',    // URL 参数 (?lng=en)
    'cookie',         // Cookie
    'localStorage',   // 本地存储
    'sessionStorage', // 会话存储
    'navigator',      // 浏览器语言
    'htmlTag',        // HTML lang 属性
    'path',           // URL 路径
    'subdomain'       // 子域名
  ],
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'],
  cookieMinutes: 10080, // 7 days
  cookieDomain: 'myDomain'
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 默认语言
    fallbackLng: 'en',
    
    // 调试模式
    debug: process.env.NODE_ENV === 'development',
    
    // 语言检测
    detection: detectionOptions,
    
    // 插值配置
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
      formatSeparator: ',',
      format: function(value, format, lng) {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'currency') return new Intl.NumberFormat(lng, { 
          style: 'currency', 
          currency: getCurrencyByLanguage(lng) 
        }).format(value);
        if (format === 'date') return new Intl.DateTimeFormat(lng).format(new Date(value));
        return value;
      }
    },
    
    // 后端配置
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/add/{{lng}}/{{ns}}',
      allowMultiLoading: false,
      crossDomain: false,
      withCredentials: false,
      requestOptions: {
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'default'
      }
    },
    
    // 命名空间
    ns: ['common', 'components', 'pages'],
    defaultNS: 'common',
    
    // React 特定配置
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    }
  });

// 获取语言对应的货币
function getCurrencyByLanguage(lng) {
  const currencyMap = {
    'en': 'USD',
    'zh-CN': 'CNY',
    'zh-TW': 'TWD',
    'ja': 'JPY',
    'ko': 'KRW',
    'es': 'EUR',
    'fr': 'EUR',
    'de': 'EUR',
    'ar': 'SAR'
  };
  return currencyMap[lng] || 'USD';
}

export default i18n;
```

### 4. 语言切换组件

```jsx
// src/components/LanguageSwitcher.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = supportedLanguages[i18n.language] || supportedLanguages['en'];
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    
    // 更新 HTML lang 属性
    document.documentElement.lang = lng;
    
    // 更新页面方向 (RTL 支持)
    document.documentElement.dir = ['ar', 'he', 'fa'].includes(lng) ? 'rtl' : 'ltr';
  };
  
  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="mr-2">{currentLanguage.flag}</span>
        {currentLanguage.name}
        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {Object.entries(supportedLanguages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={`${
                  i18n.language === code ? 'bg-gray-100' : ''
                } flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                role="menuitem"
              >
                <span className="mr-3">{lang.flag}</span>
                {lang.name}
                {i18n.language === code && (
                  <svg className="ml-auto h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
```

### 5. 自定义本地化 Hook

```javascript
// src/hooks/useLocalization.js
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();
  
  const formatters = useMemo(() => ({
    // 数字格式化
    number: (value, options = {}) => {
      return new Intl.NumberFormat(i18n.language, options).format(value);
    },
    
    // 货币格式化
    currency: (value, currency = 'USD', options = {}) => {
      return new Intl.NumberFormat(i18n.language, {
        style: 'currency',
        currency,
        ...options
      }).format(value);
    },
    
    // 日期格式化
    date: (value, options = {}) => {
      return new Intl.DateTimeFormat(i18n.language, options).format(new Date(value));
    },
    
    // 相对时间格式化
    relativeTime: (value, unit = 'day') => {
      const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });
      return rtf.format(value, unit);
    },
    
    // 列表格式化
    list: (items, options = {}) => {
      return new Intl.ListFormat(i18n.language, options).format(items);
    }
  }), [i18n.language]);
  
  const helpers = useMemo(() => ({
    // 获取当前语言方向
    getDirection: () => ['ar', 'he', 'fa'].includes(i18n.language) ? 'rtl' : 'ltr',
    
    // 获取当前语言信息
    getCurrentLanguage: () => ({
      code: i18n.language,
      name: supportedLanguages[i18n.language]?.name || 'Unknown',
      flag: supportedLanguages[i18n.language]?.flag || '🌐'
    }),
    
    // 检查是否为 RTL 语言
    isRTL: () => ['ar', 'he', 'fa'].includes(i18n.language),
    
    // 获取语言对应的时区
    getTimezone: () => {
      const timezoneMap = {
        'zh-CN': 'Asia/Shanghai',
        'zh-TW': 'Asia/Taipei',
        'ja': 'Asia/Tokyo',
        'ko': 'Asia/Seoul',
        'en': 'America/New_York',
        'es': 'Europe/Madrid',
        'fr': 'Europe/Paris',
        'de': 'Europe/Berlin',
        'ar': 'Asia/Riyadh'
      };
      return timezoneMap[i18n.language] || 'UTC';
    }
  }), [i18n.language]);
  
  return {
    t,
    i18n,
    ...formatters,
    ...helpers
  };
};
```

## 翻译文件示例

### 通用翻译 (common.json)

```json
{
  "en": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "pagination": {
      "previous": "Previous",
      "next": "Next",
      "page": "Page {{current}} of {{total}}"
    }
  },
  "zh-CN": {
    "welcome": "欢迎",
    "loading": "加载中...",
    "error": "发生错误",
    "retry": "重试",
    "cancel": "取消",
    "confirm": "确认",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "search": "搜索",
    "filter": "筛选",
    "sort": "排序",
    "pagination": {
      "previous": "上一页",
      "next": "下一页",
      "page": "第 {{current}} 页，共 {{total}} 页"
    }
  }
}
```

## 高级功能

### 1. 复数处理

```json
{
  "en": {
    "item": "item",
    "item_other": "items",
    "itemCount": "{{count}} item",
    "itemCount_other": "{{count}} items"
  },
  "zh-CN": {
    "item": "项目",
    "itemCount": "{{count}} 个项目"
  }
}
```

```jsx
// 使用复数
const { t } = useTranslation();
console.log(t('itemCount', { count: 1 })); // "1 item" / "1 个项目"
console.log(t('itemCount', { count: 5 })); // "5 items" / "5 个项目"
```

### 2. 上下文翻译

```json
{
  "en": {
    "button_male": "He clicked the button",
    "button_female": "She clicked the button",
    "button_other": "They clicked the button"
  }
}
```

```jsx
// 使用上下文
const { t } = useTranslation();
console.log(t('button', { context: 'male' })); // "He clicked the button"
```

### 3. 嵌套翻译

```json
{
  "en": {
    "user": {
      "profile": {
        "title": "User Profile",
        "fields": {
          "name": "Name",
          "email": "Email",
          "phone": "Phone"
        }
      }
    }
  }
}
```

```jsx
// 使用嵌套翻译
const { t } = useTranslation();
console.log(t('user.profile.title')); // "User Profile"
console.log(t('user.profile.fields.name')); // "Name"
```

## 性能优化

### 1. 懒加载翻译文件

```javascript
// 动态导入翻译文件
const loadTranslations = async (language) => {
  try {
    const translations = await import(`../i18n/resources/${language}/common.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
    return {};
  }
};
```

### 2. 翻译缓存

```javascript
// 缓存翻译结果
const translationCache = new Map();

const getCachedTranslation = (key, options) => {
  const cacheKey = `${key}_${JSON.stringify(options)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const translation = t(key, options);
  translationCache.set(cacheKey, translation);
  return translation;
};
```

### 3. 代码分割

```javascript
// 按页面分割翻译文件
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => 
  Promise.all([
    import('./HomePage'),
    import('../i18n/resources/en/home.json'),
    import('../i18n/resources/zh-CN/home.json')
  ]).then(([component]) => component)
);
```

## 测试策略

### 1. 单元测试

```javascript
// __tests__/i18n.test.js
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const renderWithI18n = (component, language = 'en') => {
  i18n.changeLanguage(language);
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

test('renders in English', () => {
  renderWithI18n(<App />, 'en');
  expect(screen.getByText('Welcome')).toBeInTheDocument();
});

test('renders in Chinese', () => {
  renderWithI18n(<App />, 'zh-CN');
  expect(screen.getByText('欢迎')).toBeInTheDocument();
});
```

### 2. 翻译完整性测试

```javascript
// scripts/check-translations.js
const fs = require('fs');
const path = require('path');

const checkTranslationCompleteness = () => {
  const baseLanguage = 'en';
  const languages = ['zh-CN', 'ja', 'ko', 'es', 'fr', 'de'];
  
  const basePath = path.join(__dirname, '../src/i18n/resources');
  const baseTranslations = require(path.join(basePath, baseLanguage, 'common.json'));
  
  languages.forEach(lang => {
    try {
      const translations = require(path.join(basePath, lang, 'common.json'));
      const missingKeys = findMissingKeys(baseTranslations, translations);
      
      if (missingKeys.length > 0) {
        console.warn(`Missing translations in ${lang}:`, missingKeys);
      }
    } catch (error) {
      console.error(`Failed to check translations for ${lang}:`, error);
    }
  });
};

const findMissingKeys = (base, target, prefix = '') => {
  const missing = [];
  
  Object.keys(base).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (!(key in target)) {
      missing.push(fullKey);
    } else if (typeof base[key] === 'object' && typeof target[key] === 'object') {
      missing.push(...findMissingKeys(base[key], target[key], fullKey));
    }
  });
  
  return missing;
};

checkTranslationCompleteness();
```

## 部署注意事项

### 1. 服务器端渲染 (SSR)

```javascript
// Next.js 配置
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'ar'],
    localeDetection: true
  }
};
```

### 2. CDN 配置

```javascript
// 配置翻译文件 CDN
const backend = {
  loadPath: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com/locales/{{lng}}/{{ns}}.json'
    : '/locales/{{lng}}/{{ns}}.json'
};
```

### 3. 构建优化

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ]
};
```

## 常见问题解决

### 1. 语言检测不准确
- 检查浏览器语言设置
- 验证 Accept-Language 头部
- 确认地理位置 API 权限

### 2. 翻译文件加载失败
- 检查文件路径
- 验证服务器 CORS 设置
- 确认文件格式正确

### 3. 格式化问题
- 验证 Intl API 支持
- 检查时区和货币设置
- 确认数字格式配置

## 最佳实践

1. **翻译键命名规范**
   - 使用有意义的键名
   - 采用层级结构
   - 避免过长的键名

2. **翻译质量保证**
   - 使用专业翻译服务
   - 建立翻译审核流程
   - 定期更新翻译内容

3. **性能考虑**
   - 懒加载翻译文件
   - 缓存翻译结果
   - 压缩翻译文件

4. **用户体验**
   - 提供语言切换选项
   - 记住用户语言偏好
   - 平滑的语言切换动画

5. **维护性**
   - 自动化翻译检查
   - 版本控制翻译文件
   - 监控翻译使用情况 