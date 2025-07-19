class SmartCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // Maximum number of cached items
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
    this.init();
  }

  init() {
    // Load cached data from localStorage on initialization
    this.loadFromStorage();
    
    // Set up periodic cleanup
    setInterval(() => this.cleanup(), 60 * 1000); // Cleanup every minute
    
    // Listen for storage events (for multi-tab sync)
    window.addEventListener('storage', (event) => {
      if (event.key === 'smartCache') {
        this.loadFromStorage();
      }
    });
  }

  // Generate cache key
  generateKey(key, params = {}) {
    const paramString = Object.keys(params).length > 0 
      ? JSON.stringify(params) 
      : '';
    return `${key}${paramString}`;
  }

  // Set cache item
  set(key, data, ttl = this.defaultTTL) {
    const cacheKey = this.generateKey(key);
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    };

    this.cache.set(cacheKey, item);
    
    // Remove oldest items if cache is full
    if (this.cache.size > this.maxSize) {
      this.evictOldest();
    }

    this.saveToStorage();
    return data;
  }

  // Get cache item
  get(key, params = {}) {
    const cacheKey = this.generateKey(key, params);
    const item = this.cache.get(cacheKey);

    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(cacheKey);
      this.saveToStorage();
      return null;
    }

    // Update access count and timestamp
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.cache.set(cacheKey, item);
    this.saveToStorage();

    return item.data;
  }

  // Get or fetch data
  async getOrFetch(key, fetchFunction, ttl = this.defaultTTL, params = {}) {
    const cached = this.get(key, params);
    
    if (cached !== null) {
      return cached;
    }

    try {
      const data = await fetchFunction();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Remove cache item
  remove(key, params = {}) {
    const cacheKey = this.generateKey(key, params);
    const removed = this.cache.delete(cacheKey);
    this.saveToStorage();
    return removed;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.saveToStorage();
  }

  // Get cache statistics
  getStats() {
    const items = Array.from(this.cache.values());
    const totalSize = items.length;
    const expiredItems = items.filter(item => 
      Date.now() - item.timestamp > item.ttl
    ).length;
    
    const avgAccessCount = items.length > 0 
      ? items.reduce((sum, item) => sum + item.accessCount, 0) / items.length 
      : 0;

    return {
      totalItems: totalSize,
      expiredItems,
      averageAccessCount: avgAccessCount,
      maxSize: this.maxSize
    };
  }

  // Evict oldest items
  evictOldest() {
    const items = Array.from(this.cache.entries());
    items.sort((a, b) => {
      // Sort by access count first, then by timestamp
      if (a[1].accessCount !== b[1].accessCount) {
        return a[1].accessCount - b[1].accessCount;
      }
      return a[1].timestamp - b[1].timestamp;
    });

    // Remove 20% of oldest items
    const toRemove = Math.ceil(items.length * 0.2);
    items.slice(0, toRemove).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  // Cleanup expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  // Save cache to localStorage
  saveToStorage() {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('smartCache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  // Load cache from localStorage
  loadFromStorage() {
    try {
      const cacheData = localStorage.getItem('smartCache');
      if (cacheData) {
        const entries = JSON.parse(cacheData);
        this.cache = new Map(entries);
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
      this.cache = new Map();
    }
  }

  // Preload important data
  async preloadData() {
    const preloadTasks = [
      this.preloadListings(),
      this.preloadUniversities()
      // this.preloadUserPreferences() // Disabled - endpoint doesn't exist
    ];

    try {
      await Promise.allSettled(preloadTasks);
    } catch (error) {
      console.error('Error preloading data:', error);
    }
  }

  // Preload listings
  async preloadListings() {
    try {
      const response = await fetch('http://localhost:3000/api/listings');
      if (response.ok) {
        const listings = await response.json();
        this.set('listings', listings, 10 * 60 * 1000); // 10 minutes TTL
      }
    } catch (error) {
      console.error('Error preloading listings:', error);
    }
  }

  // Preload universities
  async preloadUniversities() {
    const universities = [
      'University of Nairobi',
      'Kenyatta University',
      'Jomo Kenyatta University',
      'Moi University',
      'Egerton University',
      'Technical University of Kenya',
      'KCA University',
      'Strathmore University',
      'Kenyatta National Polytechnic',
      'Nairobi Technical Training Institute'
    ];
    
    this.set('universities', universities, 60 * 60 * 1000); // 1 hour TTL
  }

  // Preload user preferences
  // async preloadUserPreferences() {
  //   try {
  //     const user = JSON.parse(localStorage.getItem('user') || '{}');
  //     if (user._id) {
  //       const token = localStorage.getItem('token');
  //       const response = await fetch(`http://localhost:3000/api/user/preferences`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
        
  //       if (response.ok) {
  //         const preferences = await response.json();
  //         this.set(`userPreferences_${user._id}`, preferences, 30 * 60 * 1000); // 30 minutes TTL
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error preloading user preferences:', error);
  //   }
  // }

  // Cache listings with smart invalidation
  async cacheListings(filters = {}) {
    const key = 'listings';
    const fetchFunction = async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`http://localhost:3000/api/listings?${params}`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      return response.json();
    };

    return this.getOrFetch(key, fetchFunction, 10 * 60 * 1000, filters);
  }

  // Cache user data
  async cacheUserData(userId) {
    const key = 'userData';
    const fetchFunction = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      return response.json();
    };

    return this.getOrFetch(key, fetchFunction, 30 * 60 * 1000, { userId });
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  // Invalidate user-related cache
  invalidateUserCache(userId) {
    this.invalidatePattern(`user_${userId}`);
    this.invalidatePattern('userData');
    // this.invalidatePattern('userPreferences'); // Disabled - feature not implemented
  }

  // Invalidate listings cache
  invalidateListingsCache() {
    this.invalidatePattern('listings');
  }
}

// Create singleton instance
const smartCache = new SmartCache();

export default smartCache; 