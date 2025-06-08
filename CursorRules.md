# 空气质量查询工具 - Cursor 规则文档

## 项目概述
这是一个实时空气质量查询工具，支持全球主要城市的空气质量数据查询，包括 AQI 指数、污染物详情和气象信息展示。

## 技术栈规范

### 前端框架
- **主要技术**: HTML5 + CSS3 + Vanilla JavaScript
- **样式框架**: 使用现代 CSS 特性（Grid、Flexbox、CSS Variables）
- **图标库**: 使用 Unicode 字符或 CSS 绘制的图标
- **响应式设计**: 移动优先，支持多设备适配

### 代码结构要求
```
project/
├── index.html          # 主页面
├── styles/
│   ├── main.css       # 主样式文件
│   ├── components.css # 组件样式
│   └── responsive.css # 响应式样式
├── scripts/
│   ├── app.js         # 主应用逻辑
│   ├── api.js         # API 调用封装
│   └── utils.js       # 工具函数
└── assets/
    └── icons/         # 图标资源
```

## 编码规范

### JavaScript 规范
- 使用 ES6+ 语法特性
- 采用模块化设计模式
- 使用 `const`/`let` 替代 `var`
- 函数命名使用驼峰命名法
- 常量使用大写下划线命名
- 异步操作使用 async/await 语法

### CSS 规范
- 使用 BEM 命名方法论
- CSS 变量定义全局主题色彩
- 避免使用 `!important`
- 优先使用 Grid 和 Flexbox 布局
- 媒体查询断点: 768px(平板), 1024px(桌面)

### HTML 规范
- 使用语义化标签
- 保持良好的可访问性 (ARIA 标签)
- 元标签完整设置 (viewport, charset 等)

## 功能模块规范

### 1. 城市搜索模块
```javascript
// 搜索功能实现要求
const searchModule = {
  // 支持中英文城市名称
  // 实现防抖功能 (300ms)
  // 提供搜索建议
  // 处理无效输入
}
```

### 2. 数据展示模块
```javascript
// AQI 数据展示规范
const displayModule = {
  // AQI 颜色映射: 0-50(绿), 51-100(黄), 101-150(橙), 151-200(红), 201+(紫)
  // 污染物单位统一: μg/m³
  // 数据更新动画效果
  // 错误状态处理
}
```

### 3. API 集成模块
```javascript
// API 调用规范
const apiModule = {
  // 使用 fetch API
  // 实现请求重试机制 (最多3次)
  // 设置请求超时 (10秒)
  // 统一错误处理
  // 数据缓存策略 (5分钟)
}
```

## 设计系统

### 颜色规范
```css
:root {
  /* AQI 等级色彩 */
  --aqi-good: #00e400;        /* 0-50: 优秀 */
  --aqi-moderate: #ffff00;    /* 51-100: 良好 */
  --aqi-sensitive: #ff7e00;   /* 101-150: 轻度污染 */
  --aqi-unhealthy: #ff0000;   /* 151-200: 中度污染 */
  --aqi-very-unhealthy: #8f3f97; /* 201-300: 重度污染 */
  --aqi-hazardous: #7e0023;   /* 300+: 严重污染 */
  
  /* 界面主色调 */
  --primary-color: #2196f3;
  --secondary-color: #f5f5f5;
  --text-color: #333;
  --border-color: #ddd;
}
```

### 间距规范
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

## API 集成指南

### 推荐的空气质量 API 服务
1. **OpenWeatherMap Air Pollution API**
   - 免费额度: 1000次/天
   - 数据覆盖: 全球
   - 更新频率: 每小时

2. **IQAir API**
   - 免费额度: 10000次/月
   - 数据精度: 高
   - 实时更新

3. **WAQI API**
   - 免费使用
   - 数据来源: 官方监测站
   - 覆盖范围: 全球主要城市

### API 调用示例
```javascript
// 标准 API 调用模板
async function fetchAirQuality(city) {
  try {
    const response = await fetch(`${API_BASE_URL}/air-quality?city=${city}&key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000) // 10秒超时
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API 调用失败:', error);
    throw error;
  }
}
```

## 性能优化要求

### 1. 加载性能
- 图片懒加载实现
- CSS/JS 文件压缩
- 启用浏览器缓存
- 使用 CDN 加速静态资源

### 2. 运行时性能
- DOM 操作优化 (批量更新)
- 事件委托使用
- 防抖/节流实现
- 内存泄漏预防

## 错误处理规范

### 用户友好的错误信息
```javascript
const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  CITY_NOT_FOUND: '未找到该城市，请检查城市名称',
  API_LIMIT_EXCEEDED: '查询次数已达上限，请稍后再试',
  SERVER_ERROR: '服务器暂时不可用，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请重试'
};
```

## 测试要求

### 功能测试清单
- [ ] 城市搜索功能正常
- [ ] 热门城市按钮可用
- [ ] AQI 数据正确显示
- [ ] 污染物数据完整
- [ ] 颜色等级对应正确
- [ ] 响应式布局适配
- [ ] 错误处理机制有效
- [ ] 加载状态显示

### 兼容性测试
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- 移动端浏览器

## 部署配置

### 环境变量设置
```javascript
// config.js
const CONFIG = {
  API_KEY: process.env.AIR_QUALITY_API_KEY || 'your-api-key',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  CACHE_DURATION: 5 * 60 * 1000, // 5分钟缓存
  REQUEST_TIMEOUT: 10000, // 10秒超时
};
```

### 构建脚本
```json
{
  "scripts": {
    "build": "npm run minify-css && npm run minify-js",
    "minify-css": "cleancss -o dist/styles.min.css src/styles/*.css",
    "minify-js": "terser src/scripts/*.js -o dist/app.min.js",
    "serve": "http-server dist -p 8080",
    "test": "npm run test-unit && npm run test-e2e"
  }
}
```

## 开发提示

### Cursor AI 交互建议
1. **具体描述需求**: "为搜索框添加防抖功能，延迟300毫秒"
2. **提供上下文**: "在现有的 searchModule 基础上优化"
3. **指定技术栈**: "使用原生 JavaScript，不引入第三方库"
4. **明确约束条件**: "保持现有的 CSS 类名不变"

### 常见问题解决
1. **CORS 错误**: 使用代理服务器或 JSONP
2. **API 限制**: 实现本地缓存和请求队列
3. **移动端适配**: 使用 viewport meta 标签和相对单位
4. **SEO 优化**: 添加 meta 描述和结构化数据

## 版本控制规范

### Git 提交信息格式
```
<type>(<scope>): <subject>

类型:
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建/工具链更新

示例:
feat(search): 添加城市搜索防抖功能
fix(api): 修复 API 超时处理问题
```

---

遵循以上规范，可以确保空气质量查询工具的代码质量、用户体验和可维护性。在使用 Cursor AI 时，请参考这些规范来获得更精准的代码建议和优化方案。 