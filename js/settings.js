// ============================================
// عُمان في الأخبار — Settings Manager
// Theme toggle and app settings
// ============================================

const SETTINGS_KEY = 'oman_news_settings';

const DEFAULT_SETTINGS = {
  theme: 'light',
  autoRefresh: true,
  refreshInterval: 60 // minutes
};

/**
 * Load settings from localStorage
 * @returns {Object}
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Save settings to localStorage
 * @param {Object} settings
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch { /* ignore */ }
}

/**
 * Initialize theme from settings or system preference
 */
export function initTheme() {
  const settings = loadSettings();
  let theme = settings.theme;

  // If no explicit theme, detect system preference
  if (!theme || theme === 'auto') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme);
  return theme;
}

/**
 * Toggle between light and dark theme
 * @returns {string} The new theme
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);

  const settings = loadSettings();
  settings.theme = next;
  saveSettings(settings);

  return next;
}

/**
 * Apply a theme to the document
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Update theme toggle icon
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.content = theme === 'dark' ? '#0B0E14' : '#C8102E';
  }
}

/**
 * Open settings modal
 */
export function openSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close settings modal
 */
export function closeSettings() {
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
