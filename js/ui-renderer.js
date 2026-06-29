// ============================================
// عُمان في الأخبار — UI Renderer
// Renders news cards, skeletons, and manages DOM
// ============================================

/**
 * Render an array of news articles as cards into the grid
 * @param {Array} articles
 * @param {HTMLElement} container
 * @param {boolean} append - If true, append to existing content
 */
export function renderNewsCards(articles, container, append = false) {
  if (!append) {
    container.innerHTML = '';
  }

  if (!articles || articles.length === 0) {
    if (!append) {
      container.innerHTML = renderEmptyState();
    }
    return;
  }

  const fragment = document.createDocumentFragment();

  articles.forEach((article, index) => {
    const card = createNewsCard(article, index);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/**
 * Create a single news card element
 * @param {Object} article
 * @param {number} index - For staggered animation
 * @returns {HTMLElement}
 */
function createNewsCard(article, index) {
  const card = document.createElement('article');
  card.className = 'news-card';
  card.style.animationDelay = `${Math.min(index * 0.06, 0.5)}s`;
  card.id = `card-${article.id || index}`;

  const relativeDate = getRelativeDate(article.date);
  const imageWrapClass = article.image
    ? 'news-card__image-wrap'
    : 'news-card__image-wrap news-card__image-wrap--empty';
  const imageMarkup = article.image
    ? `
      <img 
        class="news-card__image" 
        src="${escapeHtml(article.image)}" 
        alt="${escapeHtml(article.title)}"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        onerror="this.closest('.news-card__image-wrap').classList.add('news-card__image-wrap--empty');this.remove()"
      />`
    : '<div class="news-card__image-placeholder">لا توجد صورة مرفقة بالخبر</div>';

  card.innerHTML = `
    <div class="${imageWrapClass}">
      ${imageMarkup}
      <div class="news-card__image-overlay"></div>
      <span class="news-card__source-badge">
        ${article.sourceIcon || '📰'} ${escapeHtml(article.source || 'مصدر غير معروف')}
      </span>
    </div>
    <div class="news-card__body">
      <h3 class="news-card__title">${escapeHtml(article.title)}</h3>
      <p class="news-card__desc">${escapeHtml(article.description)}</p>
      <div class="news-card__meta">
        <span class="news-card__date">
          📅 ${relativeDate}
        </span>
        <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="news-card__link">
          اقرأ المزيد ←
        </a>
      </div>
    </div>
  `;

  card.tabIndex = 0;
  card.setAttribute('role', 'link');
  card.setAttribute('aria-label', `فتح الخبر: ${article.title || ''}`);
  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    window.open(article.url, '_blank', 'noopener,noreferrer');
  });
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  });

  return card;
}

/**
 * Render skeleton loading cards
 * @param {HTMLElement} container
 * @param {number} count
 */
export function renderSkeletons(container, count = 6) {
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-image"></div>
      <div class="skeleton-body">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line w-80"></div>
        <div class="skeleton-line w-60"></div>
        <div class="skeleton-line w-40"></div>
      </div>
    `;
    container.appendChild(skeleton);
  }
}

/**
 * Render empty state
 * @returns {string}
 */
function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state__icon">📭</div>
      <h3 class="empty-state__title">لا توجد أخبار حالياً</h3>
      <p class="empty-state__desc">
        لم يتم العثور على أخبار في هذا القسم. جرّب تحديث البيانات أو تغيير الفلاتر.
      </p>
    </div>
  `;
}

/**
 * Update the statistics in the hero section
 * @param {Object} stats
 */
export function updateStats(stats) {
  const totalEl = document.getElementById('stat-total');
  const sourcesEl = document.getElementById('stat-sources');
  const lastUpdateEl = document.getElementById('stat-update');

  if (totalEl) {
    animateNumber(totalEl, parseInt(totalEl.textContent) || 0, stats.totalArticles);
  }
  if (sourcesEl) {
    animateNumber(sourcesEl, parseInt(sourcesEl.textContent) || 0, stats.sourcesCount);
  }
  if (lastUpdateEl) {
    const now = new Date();
    lastUpdateEl.textContent = now.toLocaleTimeString('ar-OM', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * Update the tab counts
 * @param {number} achievementCount
 * @param {number} mentionCount
 */
export function updateTabCounts(achievementCount, mentionCount) {
  const achCountEl = document.getElementById('tab-achievements-count');
  const menCountEl = document.getElementById('tab-mentions-count');

  if (achCountEl) achCountEl.textContent = achievementCount;
  if (menCountEl) menCountEl.textContent = mentionCount;
}

/**
 * Show a status banner
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 * @param {number} duration - Auto-hide after ms (0 = persistent)
 */
export function showBanner(message, type = 'info', duration = 5000) {
  // Remove existing banner
  const existing = document.querySelector('.status-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = `status-banner ${type}`;
  banner.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  const main = document.querySelector('.main');
  if (main) {
    main.insertBefore(banner, main.firstChild);
  }

  if (duration > 0) {
    setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(-10px)';
      setTimeout(() => banner.remove(), 300);
    }, duration);
  }
}

// ── Helper Functions ──

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function getRelativeDate(dateStr) {
  if (!dateStr) return 'تاريخ غير معروف';

  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'منذ أقل من ساعة';
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;

    return date.toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function animateNumber(element, from, to) {
  if (from === to) return;

  const duration = 600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (to - from) * eased);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
