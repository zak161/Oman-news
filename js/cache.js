// ============================================
// عُمان في الأخبار — Cache Manager
// LocalStorage caching with TTL support
// ============================================

const CACHE_PREFIX = 'oman_news_v10_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in ms

export const Cache = {
  /**
   * Get cached data if not expired
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;

      const { data, expiry } = JSON.parse(raw);
      if (Date.now() > expiry) {
        this.remove(key);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Store data with expiry
   * @param {string} key
   * @param {any} data
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, data, ttl = DEFAULT_TTL) {
    try {
      const entry = {
        data,
        expiry: Date.now() + ttl,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (e) {
      // Storage full — clear old entries and retry
      this.cleanup();
      try {
        const entry = { data, expiry: Date.now() + ttl, timestamp: Date.now() };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
      } catch {
        // Silent fail
      }
    }
  },

  /**
   * Remove a cached entry
   * @param {string} key
   */
  remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  },

  /**
   * Clear all expired entries
   */
  cleanup() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const { expiry } = JSON.parse(raw);
        if (Date.now() > expiry) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  },

  /**
   * Clear ALL cached news data
   */
  clearAll() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },

  /**
   * Get the timestamp of last data fetch
   * @returns {number|null}
   */
  getLastUpdate() {
    const raw = localStorage.getItem(CACHE_PREFIX + 'last_update');
    return raw ? parseInt(raw, 10) : null;
  },

  /**
   * Record the time of last successful data fetch
   */
  setLastUpdate() {
    localStorage.setItem(CACHE_PREFIX + 'last_update', Date.now().toString());
  }
};
