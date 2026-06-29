// ============================================
// عُمان في الأخبار — Main Application
// Wires everything together
// ============================================

import { fetchAllNews } from './news-engine.js';
import { isOmanRelated } from './ai-classifier.js';
import { Cache } from './cache.js';
import {
  renderNewsCards,
  renderSkeletons,
  updateStats,
  updateTabCounts,
  showBanner
} from './ui-renderer.js';
import {
  initTheme,
  toggleTheme,
  openSettings,
  closeSettings
} from './settings.js';

// ── Application State ──
const state = {
  activeTab: 'achievements',     // 'achievements' | 'mentions'
  activeFilter: 'all',
  searchQuery: '',
  achievements: [],
  mentions: [],
  isLoading: false,
  displayedCount: 9,              // Cards per page
  stats: {
    totalArticles: 0,
    achievementCount: 0,
    mentionCount: 0,
    sourcesCount: 0,
    lastUpdate: null
  }
};

// ── DOM References ──
let newsGrid, tabAchievements, tabMentions, refreshBtn, searchInput;

// ── Initialization ──
document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  newsGrid = document.getElementById('news-grid');
  tabAchievements = document.getElementById('tab-achievements');
  tabMentions = document.getElementById('tab-mentions');
  refreshBtn = document.getElementById('refresh-btn');
  searchInput = document.getElementById('search-input');

  // Initialize theme
  initTheme();

  // Set up event listeners
  setupEventListeners();

  // Load data
  loadNews(true);
});

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Tab switching
  tabAchievements?.addEventListener('click', () => switchTab('achievements'));
  tabMentions?.addEventListener('click', () => switchTab('mentions'));

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });

  // Settings
  document.getElementById('settings-btn')?.addEventListener('click', openSettings);
  document.getElementById('settings-close')?.addEventListener('click', closeSettings);
  document.getElementById('settings-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'settings-modal') closeSettings();
  });

  // Refresh
  refreshBtn?.addEventListener('click', () => loadNews(true));

  // Search
  let searchTimeout;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      renderCurrentView();
    }, 300);
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderCurrentView();
    });
  });

  // Load more button
  document.getElementById('load-more-btn')?.addEventListener('click', () => {
    state.displayedCount += 6;
    renderCurrentView();
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }
  });

  // Clear cache button in settings
  document.getElementById('clear-cache-btn')?.addEventListener('click', () => {
    Cache.clearAll();
    showBanner('تم مسح البيانات المخزنة بنجاح', 'success');
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettings();
  });
}

/**
 * Load news — first tries RSS feeds, falls back to demo data
 * @param {boolean} forceRefresh
 */
async function loadNews(forceRefresh = false) {
  if (state.isLoading) return;

  state.isLoading = true;
  refreshBtn?.classList.add('loading');
  renderSkeletons(newsGrid, 6);

  try {
    // Try fetching real news from RSS feeds
    const result = await fetchAllNews(forceRefresh);

    if (result.achievements.length > 0 || result.mentions.length > 0) {
      // Got real data!
      state.achievements = result.achievements;
      state.mentions = result.mentions;
      state.stats = result.stats;
      showBanner(`تم تحميل ${result.stats.totalArticles} خبر من ${result.stats.sourcesCount} مصادر`, 'success');
    } else {
      state.achievements = [];
      state.mentions = [];
      state.stats = result.stats || {
        totalArticles: 0,
        achievementCount: 0,
        mentionCount: 0,
        sourcesCount: 0,
        lastUpdate: new Date().toISOString()
      };
      showBanner('لم يتم العثور على أخبار حية الآن. جرّب التحديث بعد قليل.', 'info');
    }
  } catch (error) {
    console.error('[App] Failed to fetch news:', error);
    state.achievements = [];
    state.mentions = [];
    state.stats = {
      totalArticles: 0,
      achievementCount: 0,
      mentionCount: 0,
      sourcesCount: 0,
      lastUpdate: new Date().toISOString()
    };
    showBanner('تعذر الاتصال بمصادر الأخبار الحية. لم يتم عرض بيانات تجريبية.', 'error');
  }

  state.isLoading = false;
  refreshBtn?.classList.remove('loading');

  // Update UI
  updateStats(state.stats);
  updateTabCounts(state.achievements.length, state.mentions.length);
  state.displayedCount = 9;
  renderCurrentView();
}

/**
 * Switch active tab
 * @param {'achievements'|'mentions'} tab
 */
function switchTab(tab) {
  state.activeTab = tab;
  state.displayedCount = 9;

  // Update tab UI
  tabAchievements?.classList.toggle('active', tab === 'achievements');
  tabMentions?.classList.toggle('active', tab === 'mentions');

  // Render with animation
  newsGrid.style.opacity = '0';
  newsGrid.style.transform = 'translateY(10px)';

  setTimeout(() => {
    renderCurrentView();
    newsGrid.style.opacity = '1';
    newsGrid.style.transform = 'translateY(0)';
  }, 200);
}

/**
 * Render the current view based on state
 */
function renderCurrentView() {
  const articles = state.activeTab === 'achievements' ? state.achievements : state.mentions;

  // Apply search filter
  let filtered = sortNewestFirst(articles.filter(isArticleRelevantForActiveTab));
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      (a.title || '').toLowerCase().includes(query) ||
      (a.description || '').toLowerCase().includes(query) ||
      (a.source || '').toLowerCase().includes(query)
    );
  }

  // Apply source filter
  if (state.activeFilter !== 'all') {
    if (state.activeFilter === 'local') {
      filtered = filtered.filter(a => {
        const src = (a.source || '').toLowerCase();
        return src.includes('عمان') || src.includes('oman') || src.includes('muscat') ||
               src.includes('مسقط') || a.feedType === 'oman';
      });
    } else if (state.activeFilter === 'global') {
      filtered = filtered.filter(a => {
        const src = (a.source || '').toLowerCase();
        return src.includes('reuters') || src.includes('bbc') || src.includes('cnn') ||
               src.includes('bloomberg') || src.includes('guardian') ||
               src.includes('الجزيرة') || src.includes('العربية') ||
               src.includes('france') || src.includes('asharq') || src.includes('الشرق') ||
               src.includes('aawsat') || src.includes('الأوسط') ||
               src.includes('independent') || src.includes('إندبندنت') ||
               src.includes('euronews') || src.includes('يورونيوز') ||
               src.includes('anadolu') || src.includes('الأناضول') ||
               a.feedType === 'global';
      });
    }
  }

  // Paginate
  const toShow = filtered.slice(0, state.displayedCount);
  const hasMore = filtered.length > state.displayedCount;

  renderNewsCards(toShow, newsGrid);

  // Show/hide load more button
  const loadMoreWrap = document.getElementById('load-more-wrap');
  if (loadMoreWrap) {
    loadMoreWrap.style.display = hasMore ? 'flex' : 'none';
  }
}

function isArticleRelevantForActiveTab(article) {
  const title = article.title || '';
  return isOmanRelated(title);
}

function sortNewestFirst(articles) {
  return articles.slice().sort((a, b) => {
    const aTime = Date.parse(a.date || '') || 0;
    const bTime = Date.parse(b.date || '') || 0;
    return bTime - aTime;
  });
}
