// ============================================
// Oman News Engine
// Fetches live news without API keys.
// Supports RSS/Atom XML feeds and trusted HTML news listing pages.
// ============================================

import { Cache } from './cache.js';
import { classifyBatch, isOmanRelated } from './ai-classifier.js';

const NEWS_SOURCES = {
  ona_ar: {
    name: 'وكالة الأنباء العمانية',
    url: 'https://omannews.gov.om/rss.ona',
    lang: 'ar',
    type: 'oman',
    format: 'xml'
  },
  shabiba_ar: {
    name: 'الشبيبة',
    url: 'https://shabiba.com/',
    lang: 'ar',
    type: 'oman',
    format: 'html'
  },
  bing_achievements_ar: {
    name: 'Bing News إنجازات عمانية',
    url: 'https://www.bing.com/news/search?q=%D8%B9%D9%85%D8%A7%D9%86+%D8%A5%D9%86%D8%AC%D8%A7%D8%B2+OR+%D8%AC%D8%A7%D8%A6%D8%B2%D8%A9+OR+%D8%AD%D9%82%D9%82+OR+%D9%81%D8%A7%D8%B2&format=rss&cc=om&setlang=ar',
    lang: 'ar',
    type: 'oman',
    format: 'xml'
  },
  bing_mentions_ar: {
    name: 'Bing News مصادر عربية عالمية',
    url: 'https://www.bing.com/news/search?q=%D8%B9%D9%85%D8%A7%D9%86+(site%3Aaljazeera.net+OR+site%3Abbc.com%2Farabic+OR+site%3Aarabic.cnn.com+OR+site%3Aalarabiya.net+OR+site%3Afrance24.com%2Far+OR+site%3Adw.com%2Far+OR+site%3Askynewsarabia.com+OR+site%3Aaawsat.com+OR+site%3Aasharq.com+OR+site%3Aindependentarabia.com+OR+site%3Aeuronews.com%2Far+OR+site%3Aaa.com.tr%2Far)&format=rss&cc=ae&setlang=ar',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  google_oman_ar: {
    name: 'Google News عُمان',
    url: 'https://news.google.com/rss/search?q=%D8%B9%D9%85%D8%A7%D9%86+OR+%22%D8%B3%D9%84%D8%B7%D9%86%D8%A9+%D8%B9%D9%85%D8%A7%D9%86%22+when%3A14d&hl=ar&gl=OM&ceid=OM%3Aar',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  google_achievements_ar: {
    name: 'Google News إنجازات عمانية',
    url: 'https://news.google.com/rss/search?q=(%D8%B9%D9%85%D8%A7%D9%86+OR+%22%D8%B3%D9%84%D8%B7%D9%86%D8%A9+%D8%B9%D9%85%D8%A7%D9%86%22)+(%D8%A5%D9%86%D8%AC%D8%A7%D8%B2+OR+%D8%AC%D8%A7%D8%A6%D8%B2%D8%A9+OR+%D9%81%D8%A7%D8%B2+OR+%D8%AD%D9%82%D9%82+OR+%D8%AA%D8%B5%D8%AF%D8%B1)+when%3A30d&hl=ar&gl=OM&ceid=OM%3Aar',
    lang: 'ar',
    type: 'oman',
    format: 'xml'
  },
  google_global_ar: {
    name: 'Google News مصادر عربية موثوقة',
    url: 'https://news.google.com/rss/search?q=(%D8%B9%D9%85%D8%A7%D9%86+OR+%22%D8%B3%D9%84%D8%B7%D9%86%D8%A9+%D8%B9%D9%85%D8%A7%D9%86%22)+(site%3Aaljazeera.net+OR+site%3Abbc.com%2Farabic+OR+site%3Aarabic.cnn.com+OR+site%3Aalarabiya.net+OR+site%3Aaawsat.com+OR+site%3Aasharq.com+OR+site%3Aindependentarabia.com+OR+site%3Aeuronews.com%2Far+OR+site%3Aaa.com.tr%2Far)+when%3A30d&hl=ar&gl=OM&ceid=OM%3Aar',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  aljazeera_ar: {
    name: 'الجزيرة',
    url: 'https://www.aljazeera.net/aljazeerarss/ar.xml',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  bbc_arabic: {
    name: 'BBC عربي',
    url: 'https://feeds.bbci.co.uk/arabic/rss.xml',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  france24_ar: {
    name: 'فرانس24 عربي',
    url: 'https://www.france24.com/ar/rss',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  dw_ar: {
    name: 'DW عربية',
    url: 'https://rss.dw.com/xml/rss-ar-all',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  skynews_ar: {
    name: 'سكاي نيوز عربية',
    url: 'https://www.skynewsarabia.com/rss',
    lang: 'ar',
    type: 'global',
    format: 'xml'
  },
  omandaily_ar: {
    name: 'جريدة عمان',
    url: 'https://www.omandaily.om/',
    lang: 'ar',
    type: 'oman',
    format: 'html'
  },
  alroya_ar: {
    name: 'الرؤية العمانية',
    url: 'https://alroya.om/',
    lang: 'ar',
    type: 'oman',
    format: 'html'
  }
};

const CORS_PROXIES = [
  url => url,
  url => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
  url => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url)
];
const READER_PROXY = url => 'https://r.jina.ai/http://' + url;
const RSS2JSON_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

export async function fetchAllNews(forceRefresh = false) {
  if (forceRefresh) {
    Cache.clearAll();
  }

  if (!forceRefresh) {
    const cachedResult = Cache.get('all_news');
    if (cachedResult) return cachedResult;
  }

  const sourceEntries = Object.entries(NEWS_SOURCES);
  const results = await Promise.allSettled(sourceEntries.map(([key, config]) => fetchSource(key, config)));

  let allArticles = [];
  let successCount = 0;
  let failCount = 0;

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      allArticles = allArticles.concat(result.value);
      successCount++;
    } else {
      failCount++;
    }
  });

  allArticles = sortNewestFirst(deduplicateArticles(allArticles));

  const { achievements, mentions } = classifyBatch(allArticles);
  const sortedAchievements = sortNewestFirst(achievements);
  const sortedMentions = sortNewestFirst(mentions);
  const finalResult = {
    achievements: sortedAchievements,
    mentions: sortedMentions,
    stats: {
      totalArticles: sortedAchievements.length + sortedMentions.length,
      achievementCount: sortedAchievements.length,
      mentionCount: sortedMentions.length,
      sourcesCount: successCount,
      failedSources: failCount,
      lastUpdate: new Date().toISOString()
    }
  };

  Cache.set('all_news', finalResult, 10 * 60 * 1000);
  Cache.setLastUpdate();
  return finalResult;
}

export function getAvailableSources() {
  return Object.entries(NEWS_SOURCES).map(([key, config]) => ({
    key,
    name: config.name,
    type: config.type
  }));
}

async function fetchSource(sourceKey, config) {
  const cached = Cache.get(`feed_${sourceKey}`);
  if (cached) return cached;

  try {
    let parsed = [];
    try {
      const text = await fetchTextWithFallback(config.url, config.format === 'html');
      parsed = config.format === 'html'
        ? parseHtmlArticles(text, config)
        : parseXmlArticles(text, config);
    } catch (error) {
      if (config.format !== 'xml') throw error;
      parsed = await fetchRss2JsonArticles(config);
    }

    const articles = await Promise.all(parsed.map(async article => {
      if (!article.image) article.image = await fetchArticleImage(article.url);
      return article;
    }));

    const filtered = articles.filter(article => isOmanRelated(article.title));

    const sorted = sortNewestFirst(filtered);
    Cache.set(`feed_${sourceKey}`, sorted, 10 * 60 * 1000);
    return sorted;
  } catch (error) {
    console.warn(`[NewsEngine] Failed to fetch ${config.name}:`, error.message);
    return [];
  }
}

async function fetchTextWithFallback(url, allowReader = false) {
  const errors = [];
  const builders = allowReader ? CORS_PROXIES.concat(READER_PROXY) : CORS_PROXIES;

  for (const buildUrl of builders) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(buildUrl(url), { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      if (!text || /request is being verified|javascript is required/i.test(text)) {
        throw new Error('Blocked response');
      }

      return text;
    } catch (error) {
      errors.push(error.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(errors.join(' | '));
}

async function fetchRss2JsonArticles(config) {
  const response = await fetch(RSS2JSON_BASE + encodeURIComponent(config.url));
  if (!response.ok) throw new Error(`rss2json HTTP ${response.status}`);

  const data = await response.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) {
    throw new Error('Invalid rss2json response');
  }

  return data.items.map(item => {
    const rawTitle = item.title || '';
    const title = rawTitle.replace(/\s[-–—]\s[^-–—]+$/, '').trim() || rawTitle;
    let source = item.author || config.name;

    if (config.name.includes('Google News')) {
      const match = rawTitle.match(/\s[-–—]\s(.+)$/);
      if (match) source = match[1].trim();
    }

    const articleUrl = item.link || '#';
    const image = extractImageFromItem(item, articleUrl);

    return normalizeArticle({
      title,
      descriptionHtml: item.description || item.content || '',
      source,
      date: item.pubDate,
      url: articleUrl,
      image,
      lang: config.lang,
      feedType: config.type
    });
  }).filter(Boolean);
}

function parseXmlArticles(xmlText, config) {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');

  const nodes = Array.from(doc.querySelectorAll('item, entry'));
  if (!nodes.length) throw new Error('No feed items');

  return nodes.map(node => {
    const rawTitle = nodeText(node, ['title']).trim();
    const title = rawTitle.replace(/\s[-–—]\s[^-–—]+$/, '').trim() || rawTitle;
    const linkNode = node.getElementsByTagName('link')[0];
    const link = normalizeArticleUrl(linkNode?.getAttribute('href') || nodeText(node, ['link', 'guid']).trim(), config.url);
    const descriptionHtml = nodeText(node, ['description', 'summary', 'content', 'content:encoded']);
    let source = nodeText(node, ['News:Source', 'source']).trim() || config.name;

    if (config.name.includes('Google News') && rawTitle) {
      const match = rawTitle.match(/\s[-–—]\s(.+)$/);
      if (match) source = match[1].trim();
    }

    const image = extractImageFromItem({
      image: nodeText(node, ['News:Image']),
      content: descriptionHtml,
      description: descriptionHtml,
      thumbnail: nodeAttr(node, ['media:thumbnail'], 'url'),
      enclosure: { link: nodeAttr(node, ['media:content', 'enclosure'], 'url') }
    }, link);

    return normalizeArticle({
      title,
      descriptionHtml,
      source,
      date: nodeText(node, ['pubDate', 'published', 'updated', 'dc:date']),
      url: link,
      image,
      lang: config.lang,
      feedType: config.type
    });
  }).filter(Boolean);
}

function parseHtmlArticles(htmlText, config) {
  if (/Markdown Content:|##\s+\[[^\]]+\]\(https?:\/\//.test(htmlText)) {
    return parseMarkdownArticles(htmlText, config);
  }

  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  const anchors = Array.from(doc.querySelectorAll(
    'article a[href], h1 a[href], h2 a[href], h3 a[href], h4 a[href], .news-card a[href], .card a[href], .item a[href], li a[href], a[href]'
  ));
  const articles = [];
  const seen = new Set();

  anchors.forEach(anchor => {
    const url = normalizeArticleUrl(anchor.getAttribute('href'), config.url);
    const container = anchor.closest('article, .news-card, .card, .item, li, .col-md-4, .col-md-6, .story, .post') || anchor.parentElement;
    const heading = container?.querySelector('h1, h2, h3, h4') || anchor;
    const title = cleanText(heading.textContent || anchor.textContent || '');

    if (!isLikelyArticleUrl(url, title) || seen.has(url)) return;
    seen.add(url);

    const descNode = container?.querySelector('p');
    const descText = descNode ? descNode.textContent : container?.textContent || '';
    const timeNode = container?.querySelector('time[datetime], time');
    const dateText = timeNode?.getAttribute('datetime') || timeNode?.textContent || extractDateText(container?.textContent || '');
    const image = extractImageFromHtml(container?.outerHTML || anchor.outerHTML, url);

    articles.push(normalizeArticle({
      title,
      descriptionHtml: descText,
      source: config.name,
      date: dateText,
      url,
      image,
      lang: config.lang,
      feedType: config.type
    }));
  });

  return articles.filter(Boolean).slice(0, 18);
}

function parseMarkdownArticles(markdown, config) {
  const articles = [];
  const pattern = /(?:!\[[^\]]*\]\((https?:\/\/[^)]+)\)\s*)?(?:###\s*([^\n]+)\s*)?##\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*([\s\S]*?)(?=\n!\[[^\]]*\]\(|\n###\s|\n##\s*\[|$)/g;
  let match;

  while ((match = pattern.exec(markdown)) !== null) {
    const image = normalizeImageUrl(match[1], config.url);
    const date = match[2] || '';
    const title = match[3] || '';
    const url = normalizeArticleUrl(match[4], config.url);
    const description = (match[5] || '')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/\[[^\]]+\]\([^)]+\)/g, '')
      .trim();

    articles.push(normalizeArticle({
      title,
      descriptionHtml: description,
      source: config.name,
      date,
      url,
      image,
      lang: config.lang,
      feedType: config.type
    }));
  }

  return articles.filter(Boolean).slice(0, 18);
}

async function fetchArticleImage(articleUrl) {
  if (!/^https?:\/\//i.test(articleUrl || '')) return '';

  const cacheKey = 'article_image_' + articleUrl;
  const cached = Cache.get(cacheKey);
  if (cached !== null) return cached || '';

  try {
    const html = await fetchTextWithFallback(articleUrl);
    const image = extractImageFromHtml(html, articleUrl);
    Cache.set(cacheKey, image || '', image ? 6 * 60 * 60 * 1000 : 30 * 60 * 1000);
    return image || '';
  } catch {
    Cache.set(cacheKey, '', 30 * 60 * 1000);
    return '';
  }
}

function normalizeArticle(raw) {
  const title = cleanText(raw.title || '');
  if (title.length < 10) return null;

  const description = cleanText(raw.descriptionHtml || '')
    .replace(title, '')
    .trim()
    .slice(0, 500);
  const date = formatDate(raw.date);

  return {
    id: 'art_' + hashText((raw.url || title) + date),
    title,
    description,
    source: raw.source || 'مصدر إخباري',
    sourceIcon: getSourceIcon(raw.source || ''),
    date,
    url: raw.url || '#',
    image: raw.image || '',
    lang: raw.lang,
    feedType: raw.feedType
  };
}

function extractImageFromItem(item, baseUrl) {
  const htmlFields = [item.content, item.description, item['content:encoded'], item.summary];
  for (const html of htmlFields) {
    const image = extractImageFromHtml(html, baseUrl);
    if (image) return image;
  }

  const mediaCandidates = [
    getMediaValue(item.image),
    getMediaValue(item.thumbnail),
    getMediaValue(item.enclosure),
    getMediaValue(item['media:content']),
    getMediaValue(item['media:thumbnail'])
  ];

  for (const candidate of mediaCandidates) {
    const image = normalizeImageUrl(candidate, baseUrl);
    if (image) return image;
  }

  for (const html of htmlFields) {
    const match = String(html || '').match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif|avif)(?:[^\s"'<>]*)?/i);
    const image = normalizeImageUrl(match && match[0], baseUrl);
    if (image) return image;
  }

  return '';
}

function extractImageFromHtml(html, baseUrl) {
  if (!html) return '';

  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  const metaSelectors = [
    'meta[property="og:image:secure_url"]',
    'meta[property="og:image:url"]',
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:src"]',
    'meta[name="thumbnail"]',
    'link[rel="image_src"]'
  ];

  for (const selector of metaSelectors) {
    const element = doc.querySelector(selector);
    const image = normalizeImageUrl(element && (element.getAttribute('content') || element.getAttribute('href')), baseUrl);
    if (image) return image;
  }

  const imageSelectors = [
    'article picture source[srcset]',
    'article img',
    'main picture source[srcset]',
    'main img',
    'figure picture source[srcset]',
    'figure img',
    'img'
  ];

  for (const selector of imageSelectors) {
    const elements = Array.from(doc.querySelectorAll(selector));
    for (const element of elements) {
      if (isTinyImageElement(element)) continue;
      const image = normalizeImageUrl(
        pickFromSrcset(element.getAttribute('srcset') || element.getAttribute('data-srcset')) ||
        element.getAttribute('data-src') ||
        element.getAttribute('data-original') ||
        element.getAttribute('data-lazy-src') ||
        element.getAttribute('src'),
        baseUrl
      );
      if (image) return image;
    }
  }

  return '';
}

function cleanText(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return (div.textContent || div.innerText || '').trim().replace(/\s+/g, ' ');
}

function nodeText(node, names) {
  for (const name of names) {
    const found = node.getElementsByTagName(name)[0];
    if (found) return found.textContent || '';
  }
  return '';
}

function nodeAttr(node, names, attr) {
  for (const name of names) {
    const found = node.getElementsByTagName(name)[0];
    if (found && found.getAttribute(attr)) return found.getAttribute(attr);
  }
  return '';
}

function getMediaValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = getMediaValue(item);
      if (result) return result;
    }
    return '';
  }
  return value.url || value.link || value.href || value.thumbnail || value.content || '';
}

function pickFromSrcset(srcset) {
  if (!srcset) return '';
  const candidates = srcset.split(',').map(part => part.trim().split(/\s+/)[0]).filter(Boolean);
  return candidates[candidates.length - 1] || '';
}

function normalizeImageUrl(url, baseUrl) {
  if (!url) return '';
  let clean = decodeHtml(String(url).trim());
  if (!clean || clean.startsWith('data:') || clean.startsWith('blob:')) return '';
  if (clean.startsWith('//')) clean = 'https:' + clean;

  try {
    clean = new URL(clean, baseUrl || window.location.href).href;
  } catch {
    return '';
  }

  const lower = clean.toLowerCase();
  if (lower.includes('favicon') || lower.includes('spacer') || lower.includes('pixel') ||
      lower.includes('transparent') || lower.includes('blank') || lower.includes('sprite') ||
      lower.endsWith('.svg')) {
    return '';
  }

  return clean;
}

function normalizeArticleUrl(url, baseUrl) {
  try {
    const parsed = new URL(url, baseUrl);
    if (parsed.hostname.includes('bing.com') && parsed.pathname.includes('/news/apiclick')) {
      const original = parsed.searchParams.get('url');
      if (original) return decodeHtml(original);
    }
    return parsed.href;
  } catch {
    return '';
  }
}

function isLikelyArticleUrl(url, title) {
  if (!url || !/^https?:\/\//i.test(url) || title.length < 12) return false;
  const lower = url.toLowerCase();
  if (lower.endsWith('/#') || lower.includes('/#') || /@|^\+?\d[\d\s-]+$/.test(title)) return false;
  if (/facebook|twitter|instagram|youtube|linkedin|play\.google|apps\.apple|mailto:|javascript:/.test(lower)) return false;
  if (/\/(category|tag|author|about|about-us|contact|privacy|terms|rss|login|subscribe|advertise)(\/|$)/i.test(lower)) return false;
  if (/^\d+$/.test(title) || /^(oman|world|business|sports|opinion|technology|home)$/i.test(title)) return false;
  return true;
}

function extractDateText(text) {
  const match = String(text || '').match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*\d{1,2}\/[A-Za-z]+\/\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?/i);
  return match ? match[0] : '';
}

function formatDate(dateValue) {
  if (!dateValue) return '';

  const normalized = String(dateValue)
    .replace(/(\d{1,2})\/([A-Za-z]+)\/(\d{4})/, '$1 $2 $3')
    .replace(/(\d{1,2}):(\d{2})\s*PM/i, (_, hour, minute) => Number(hour) > 12 ? `${hour}:${minute}` : `${hour}:${minute} PM`)
    .replace(/(\d{1,2}):(\d{2})\s*AM/i, '$1:$2 AM')
    .replace(/\s+/g, ' ')
    .trim();

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().split('T')[0];
}

function sortNewestFirst(articles) {
  return articles.slice().sort((a, b) => {
    const aTime = Date.parse(a.date || '') || 0;
    const bTime = Date.parse(b.date || '') || 0;
    return bTime - aTime;
  });
}

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function isTinyImageElement(element) {
  const width = parseInt(element.getAttribute('width') || element.getAttribute('data-width') || '0', 10);
  const height = parseInt(element.getAttribute('height') || element.getAttribute('data-height') || '0', 10);
  return (width > 0 && width < 80) || (height > 0 && height < 80);
}

function getSourceIcon(sourceName) {
  const source = sourceName.toLowerCase();
  if (source.includes('bbc')) return '🟣';
  if (source.includes('cnn')) return '🔴';
  if (source.includes('reuters') || source.includes('رويترز')) return '🔵';
  if (source.includes('bloomberg') || source.includes('بلومبرغ')) return '🟡';
  if (source.includes('jazeera') || source.includes('الجزيرة')) return '🟠';
  if (source.includes('guardian')) return '🔴';
  if (source.includes('france') || source.includes('فرانس')) return '🇫🇷';
  if (source.includes('dw') || source.includes('دويتشه')) return '🇩🇪';
  if (source.includes('sky') || source.includes('سكاي')) return '🔷';
  if (source.includes('arabiya') || source.includes('العربية')) return '🟤';
  if (source.includes('asharq') || source.includes('الشرق')) return '🟢';
  if (source.includes('aawsat') || source.includes('الأوسط')) return '🟩';
  if (source.includes('independent') || source.includes('إندبندنت')) return '🟥';
  if (source.includes('euronews') || source.includes('يورونيوز')) return '🔹';
  if (source.includes('aa.com') || source.includes('الأناضول') || source.includes('anadolu')) return '🔸';
  if (source.includes('الشبيبة') || source.includes('جريدة') || source.includes('العمانية') ||
      source.includes('observer') || source.includes('times') || source.includes('oman') || source.includes('عمان')) return '🇴🇲';
  return '📰';
}

function deduplicateArticles(articles) {
  const seen = new Map();

  for (const article of articles) {
    const key = (article.url || article.title || '')
      .toLowerCase()
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/\?.*$/, '')
      .slice(0, 120);

    if (!seen.has(key)) seen.set(key, article);
  }

  return Array.from(seen.values());
}
