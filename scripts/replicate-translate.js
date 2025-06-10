const axios = require('axios');
const { baiduTranslate } = require('./baidu-translate');
const { argosTranslate } = require('./argos-translate');
const { myMemoryTranslate } = require('./my-memory-translate');
const { libreTranslate } = require('./libre-translate');

const REPLICATE_TOKEN = 'r8_E3ywmGt4quLK4vUAXGI9huCkPr9hL2l1ibO6S';
const REPLICATE_VERSION = 'f7e4e6b7e2b6b1e2e2e2e2e2e2e2e2e2e2';

const BAIDU_LANG_MAP = {
  'km': 'km',
  'ur': 'ur',
  'ne': 'ne',
  'bs': 'bs',
  'sr': 'sr',
  'hr': 'hr',
  'ga': 'ga',
};

const MYMEMORY_LANG_MAP = {
  'km': 'km',
  'ur': 'ur',
  'ne': 'ne',
  'bs': 'bs',
  'sr': 'sr',
  'hr': 'hr',
  'ga': 'ga',
};

const REPLICATE_LANG_MAP = {
  'km': 'km_KH',
  'ur': 'ur_PK',
  'ne': 'ne_NP',
  'bs': 'bs_BA',
  'sr': 'sr_RS',
  'hr': 'hr_HR',
  'ga': 'ga_IE',
  // 可补充其它小语种
};

async function replicateTranslate(q, lang) {
  const sourceLanguage = 'en_XX';
  const targetLanguage = REPLICATE_LANG_MAP[lang];
  if (!targetLanguage) return q;
  try {
    const res = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: REPLICATE_VERSION,
        input: {
          source_language: sourceLanguage,
          target_language: targetLanguage,
          text: q,
        }
      },
      {
        headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
        timeout: 30000
      }
    );
    if (res.data && res.data.output) {
      const output = Array.isArray(res.data.output) ? res.data.output.join(' ') : res.data.output;
      console.log(`[REPLICATE] en->${lang}: '${q}' => '${output}'`);
      return output;
    }
    return q;
  } catch (e) {
    console.error('[REPLICATE] API error:', e.response ? e.response.data : e.message);
    return q;
  }
}

async function translateValue(value, lang) {
  if (!value || typeof value !== 'string' || !value.trim()) return value;
  if (lang === 'en') return value;
  await new Promise(r => setTimeout(r, 1000));
  const baiduLang = BAIDU_LANG_MAP[lang];
  const myMemoryLang = MYMEMORY_LANG_MAP[lang];
  let translated = value;
  // 只有百度支持的语种才用百度
  if (baiduLang && !['', undefined, null].includes(baiduLang)) {
    translated = await baiduTranslate(value, baiduLang);
    if (translated !== value) return translated;
  }
  // 百度不支持或失败，自动用 Argos/MyMemory/Libre
  translated = await argosTranslate(value, lang);
  if (translated !== value) return translated;
  if (myMemoryLang) {
    translated = await myMemoryTranslate(value, myMemoryLang);
    if (translated !== value) return translated;
  }
  translated = await libreTranslate(value, lang);
  if (translated !== value) return translated;
  // 新增：Replicate 兜底
  if (REPLICATE_LANG_MAP[lang]) {
    translated = await replicateTranslate(value, lang);
    if (translated !== value) return translated;
  }
  return translated;
}

module.exports = { translateValue }; 