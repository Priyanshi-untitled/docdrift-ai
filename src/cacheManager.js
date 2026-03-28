const fs = require('fs');
const path = require('path');
const { contentHash, log } = require('./utils');

class CacheManager {
  constructor(repoPath) {
    this.cacheDir = path.join(repoPath, '.docdrift-cache');
    this.cacheFile = path.join(this.cacheDir, 'analysis-cache.json');
    this.cache = {};
    this.hits = 0;
    this.misses = 0;
    this._loadCache();
  }

  _loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const raw = fs.readFileSync(this.cacheFile, 'utf-8');
        this.cache = JSON.parse(raw);
        // Expire entries older than 24 hours
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        for (const key of Object.keys(this.cache)) {
          if (now - this.cache[key].timestamp > oneDay) {
            delete this.cache[key];
          }
        }
      }
    } catch (e) {
      this.cache = {};
    }
  }

  get(docContent, codeContent) {
    const key = contentHash(docContent + '||' + codeContent);
    if (this.cache[key]) {
      this.hits++;
      return this.cache[key].result;
    }
    this.misses++;
    return null;
  }

  set(docContent, codeContent, result) {
    const key = contentHash(docContent + '||' + codeContent);
    this.cache[key] = {
      result,
      timestamp: Date.now()
    };
  }

  save() {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (e) {
      // Silently fail
    }
  }

  stats() {
    return {
      hits: this.hits,
      misses: this.misses,
      total: this.hits + this.misses,
      hitRate: this.hits + this.misses > 0
        ? Math.round((this.hits / (this.hits + this.misses)) * 100)
        : 0
    };
  }
}

module.exports = { CacheManager };