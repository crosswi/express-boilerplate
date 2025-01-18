import { Cacheable } from 'cacheable';
import logger from '../config/logger.js';

class CacheService {
  constructor() {
    this.cache = new Cacheable({
      // Default TTL of 1 hour
      ttl: 3600,
      // Maximum 1000 items in cache
      max: 1000,
    });

    logger.info('Cache service initialized');
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  async set(key, value, ttl = 3600) {
    try {
      await this.cache.set(key, value, ttl);
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   */
  async get(key) {
    try {
      return await this.cache.get(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete a value from cache
   * @param {string} key - Cache key
   */
  async del(key) {
    try {
      await this.cache.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  async clear() {
    try {
      await this.cache.clear();
      return true;
    } catch (error) {
      logger.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Wrap a function with caching
   * @param {string} key - Cache key
   * @param {Function} fn - Function to cache
   * @param {number} ttl - Time to live in seconds
   */
  async wrap(key, fn, ttl = 3600) {
    try {
      return await this.cache.wrap(key, fn, ttl);
    } catch (error) {
      logger.error('Cache wrap error:', error);
      return null;
    }
  }
}

export const cacheService = new CacheService();
export default cacheService; 