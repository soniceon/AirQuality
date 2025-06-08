// 用于批量翻译en.json为多语言json文件
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { appid, secret } = require('../src/i18n/baidu.config');

const LANGS = [
  'fra', // 法语
  'ara'  // 阿拉伯语
]; // 目标语言，分批翻译

const EN_PATH = path.join(__dirname, '../src/i18n/locales/en.json');
const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales/');

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

async function baiduTranslate(q, to, from = 'en') {
  const salt = Date.now();
  const sign = md5(appid + q + salt + secret);
  const params = new URLSearchParams({
    q,
    from,
    to,
    appid,
    salt: salt.toString(),
    sign
  });
  const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?${params.toString()}`;
  const res = await axios.get(url);
  if (res.data && res.data.trans_result && res.data.trans_result[0]) {
    return res.data.trans_result.map(item => item.dst).join('\n');
  } else {
    throw new Error(JSON.stringify(res.data));
  }
}

async function translateObject(obj, to) {
  if (typeof obj === 'string') {
    return await baiduTranslate(obj, to);
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, to)));
  } else if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = await translateObject(obj[key], to);
    }
    return result;
  } else {
    return obj;
  }
}

async function main() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
  for (const lang of LANGS) {
    console.log(`Translating to ${lang}...`);
    const translated = await translateObject(en, lang);
    fs.writeFileSync(path.join(LOCALES_DIR, `${lang}.json`), JSON.stringify(translated, null, 2), 'utf-8');
    console.log(`Saved ${lang}.json`);
  }
  console.log('All done!');
}

main().catch(e => console.error(e)); 