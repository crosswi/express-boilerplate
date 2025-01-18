import cacheService from '../services/cache.service.js';

/**
 * Cache middleware for Express routes
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
const cache = (ttl = 3600) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    
    try {
      // Try to get from cache first
      const cachedResponse = await cacheService.get(key);
      
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Store original json function
      const originalJson = res.json;
      
      // Override res.json to cache the response
      res.json = function(body) {
        // Restore original json function
        res.json = originalJson;
        
        // Cache the response
        cacheService.set(key, body, ttl);
        
        // Send the response
        return res.json(body);
      };

      next();
    } catch (error) {
      // If there's an error with caching, just continue without it
      next();
    }
  };
};

export default cache; 