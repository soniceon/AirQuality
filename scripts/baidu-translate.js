const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 百度翻译配置
const BAIDU_APP_ID = '20250518002360182';
const BAIDU_KEY = 'QpB6pM_wA7S7nmREWEEh';

const BAIDU_LANG_MAP = {
  'km': 'km',
  'ur': 'ur',
  'ne': 'ne',
  'bs': 'bs',
  'sr': 'sr',
  'hr': 'hr',
  'ga': 'ga',
};

// 生成百度翻译签名
function generateSign(text, salt) {
  const str = BAIDU_APP_ID + text + salt + BAIDU_KEY;
  return require('crypto').createHash('md5').update(str).digest('hex');
}

// 百度翻译函数
async function baiduTranslate(q, lang) {
  if (!q || typeof q !== 'string' || !q.trim()) return q;
  if (lang === 'en') return q;
  
  const salt = Date.now();
  const sign = generateSign(q, salt);
  
  try {
    const res = await axios.get('https://api.fanyi.baidu.com/api/trans/vip/translate', {
      params: {
        q,
        from: 'en',
        to: lang,
        appid: BAIDU_APP_ID,
        salt,
        sign
      },
      timeout: 5000
    });
    
    if (res.data && res.data.trans_result && res.data.trans_result[0]) {
      const translated = res.data.trans_result[0].dst;
      console.log(`[BAIDU] en->${lang}: '${q}' => '${translated}'`);
      return translated;
    }
    return q;
  } catch (e) {
    console.error('[BAIDU] API error:', e.response ? e.response.data : e.message);
    return q;
  }
}

// 主函数
async function main() {
  try {
    // 读取需要翻译的文件
    const inputFile = path.join(__dirname, '../src/i18n/locales/en.json');
    const outputDir = path.join(__dirname, '../src/i18n/locales');
    
    if (!fs.existsSync(inputFile)) {
      console.error('Input file not found:', inputFile);
      return;
    }
    
    const enData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    // 遍历所有目标语言
    for (const lang of Object.keys(BAIDU_LANG_MAP)) {
      console.log(`\nTranslating to ${lang}...`);
      const outputFile = path.join(outputDir, `${lang}.json`);
      
      // 读取现有翻译（如果存在）
      let existingData = {};
      if (fs.existsSync(outputFile)) {
        existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      }
      
      // 翻译每个键值
      for (const [key, value] of Object.entries(enData)) {
        if (typeof value === 'string' && !existingData[key]) {
          console.log(`Translating: ${key}`);
          existingData[key] = await baiduTranslate(value, lang);
          // 保存进度
          fs.writeFileSync(outputFile, JSON.stringify(existingData, null, 2), 'utf8');
          // 等待1秒，避免请求过快
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      
      console.log(`Completed ${lang} translation`);
    }
    
    console.log('\nAll translations completed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// 运行主函数
main();