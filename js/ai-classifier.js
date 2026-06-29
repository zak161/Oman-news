// ============================================
// عُمان في الأخبار — AI Classifier
// Smart keyword-based news classification
// No API key required — runs 100% client-side
// ============================================

// ── Achievement Keywords (weighted) ──
const ACHIEVEMENT_KEYWORDS = {
  // High-confidence Arabic keywords (weight: 3)
  high_ar: [
    'إنجاز', 'فوز', 'فازت', 'فاز', 'يفوز', 'حقق', 'حققت', 'يحقق', 'جائزة', 'جوائز', 'ابتكار', 'اختراع',
    'براءة اختراع', 'ميدالية', 'ذهبية', 'بطولة', 'رقم قياسي', 'تأهل',
    'أول عماني', 'أول عمانية', 'تكريم', 'تميز', 'تفوق', 'متفوق',
    'منحة دراسية', 'اكتشاف', 'طفرة', 'سبق علمي', 'ريادة'
  ],
  // Medium-confidence Arabic (weight: 2)
  medium_ar: [
    'نجاح', 'تصنيف', 'مرتبة', 'المركز الأول', 'الأفضل', 'الأولى',
    'تطوير', 'تقدم', 'تحسن', 'ارتقاء', 'انطلاق', 'افتتاح', 'إطلاق', 'أطلقت', 'تدشين', 'اعتماد',
    'شراكة', 'اتفاقية', 'استثمار', 'مشروع رائد', 'مبادرة',
    'اعتراف دولي', 'تصدر', 'صدارة'
  ],
  // High-confidence English (weight: 3)
  high_en: [
    'achievement', 'award', 'wins', 'won', 'winner', 'innovation',
    'first omani', 'record', 'medal', 'champion', 'championship',
    'breakthrough', 'patent', 'discovery', 'pioneer', 'excellence'
  ],
  // Medium-confidence English (weight: 2)
  medium_en: [
    'success', 'ranked', 'top', 'leading', 'milestone', 'launch',
    'partnership', 'investment', 'initiative', 'recognized', 'honored'
  ]
};

// ── Global Mention Sources ──
const GLOBAL_SOURCES = [
  'reuters', 'al jazeera', 'الجزيرة', 'bbc', 'cnn',
  'the guardian', 'guardian', 'bloomberg', 'بلومبرغ', 'بلومبيرغ',
  'france 24', 'فرانس 24', 'فرانس24', 'dw', 'financial times',
  'al arabiya', 'العربية', 'associated press', 'ap news',
  'afp', 'nyt', 'new york times', 'washington post',
  'the economist', 'sky news', 'سكاي نيوز',
  'cnbc', 'forbes', 'wall street journal', 'wsj',
  'independent', 'إندبندنت', 'telegraph',
  'asharq', 'الشرق', 'aawsat', 'الشرق الأوسط',
  'euronews', 'يورونيوز', 'anadolu', 'الأناضول',
  'cnn arabic', 'cnn بالعربية'
];

// ── Oman-related Keywords (to confirm relevance) ──
const OMAN_KEYWORDS = [
  'عمان', 'عُمان', 'سلطنة عمان', 'عماني', 'عمانية', 'عمانيون',
  'مسقط', 'صلالة', 'نزوى', 'صحار', 'خصب', 'مطرح', 'الدقم',
  'ظفار', 'مسندم', 'البريمي',
  'شمال الباطنة', 'جنوب الباطنة', 'جنوب الشرقية', 'شمال الشرقية',
  'جلالة السلطان', 'السيد أسعد', 'محافظة مسقط',
  'oman', 'omani', 'muscat', 'salalah', 'nizwa', 'sohar',
  'sultanate of oman', 'sultan qaboos', 'السلطان هيثم',
  'جامعة السلطان قابوس', 'الخطوط العمانية'
];

/**
 * Classify a news article into 'achievement' or 'mention'
 * @param {Object} article - { title, description, source }
 * @returns {Object} { category, confidence, score, matchedKeywords }
 */
export function classifyArticle(article) {
  const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  const source = (article.source || '').toLowerCase();

  // Check if article is about Oman
  const isOmanRelated = OMAN_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
  if (!isOmanRelated) {
    return { category: 'irrelevant', confidence: 0, score: 0, matchedKeywords: [] };
  }

  // Calculate achievement score
  let achievementScore = 0;
  const matchedKeywords = [];

  // High-confidence Arabic keywords (3 points each)
  for (const kw of ACHIEVEMENT_KEYWORDS.high_ar) {
    if (text.includes(kw)) {
      achievementScore += 3;
      matchedKeywords.push(kw);
    }
  }

  // Medium-confidence Arabic (2 points each)
  for (const kw of ACHIEVEMENT_KEYWORDS.medium_ar) {
    if (text.includes(kw)) {
      achievementScore += 2;
      matchedKeywords.push(kw);
    }
  }

  // High-confidence English (3 points each)
  for (const kw of ACHIEVEMENT_KEYWORDS.high_en) {
    if (text.includes(kw)) {
      achievementScore += 3;
      matchedKeywords.push(kw);
    }
  }

  // Medium-confidence English (2 points each)
  for (const kw of ACHIEVEMENT_KEYWORDS.medium_en) {
    if (text.includes(kw)) {
      achievementScore += 2;
      matchedKeywords.push(kw);
    }
  }

  // Check if source is a global outlet
  const isGlobalSource = GLOBAL_SOURCES.some(s => source.includes(s));

  // Decision logic
  let category, confidence;

  if (achievementScore >= 5) {
    // Strong achievement signals
    category = 'achievement';
    confidence = Math.min(achievementScore / 10, 1);
  } else if (isGlobalSource) {
    // Global source mentioning Oman.
    category = 'mention';
    confidence = 0.8;
  } else if (achievementScore >= 2) {
    // Weak achievement signal — could go either way
    category = 'achievement';
    confidence = achievementScore / 8;
  } else {
    // Local non-achievement news should not enter either public tab.
    category = isGlobalSource ? 'mention' : 'irrelevant';
    confidence = isGlobalSource ? 0.6 : 0.2;
  }

  return {
    category,
    confidence: Math.round(confidence * 100) / 100,
    score: achievementScore,
    matchedKeywords,
    isGlobalSource
  };
}

/**
 * Classify a batch of articles
 * @param {Array} articles
 * @returns {{ achievements: Array, mentions: Array }}
 */
export function classifyBatch(articles) {
  const achievements = [];
  const mentions = [];

  for (const article of articles) {
    const result = classifyArticle(article);
    const enrichedArticle = {
      ...article,
      classification: result
    };

    if (result.category === 'achievement') {
      achievements.push(enrichedArticle);
    } else if (result.category === 'mention') {
      mentions.push(enrichedArticle);
    }
    // 'irrelevant' articles are silently dropped
  }

  // Sort by confidence (highest first), then by date
  const sortFn = (a, b) => {
    const confDiff = (b.classification?.confidence || 0) - (a.classification?.confidence || 0);
    if (Math.abs(confDiff) > 0.1) return confDiff;
    return new Date(b.date || 0) - new Date(a.date || 0);
  };

  achievements.sort(sortFn);
  mentions.sort(sortFn);

  return { achievements, mentions };
}

/**
 * Check if a text is likely Oman-related
 * @param {string} text
 * @returns {boolean}
 */
export function isOmanRelated(text) {
  const lower = text.toLowerCase();
  return OMAN_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
}
