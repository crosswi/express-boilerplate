import { PrismaClient } from '@prisma/client';
import logger from '../config/logger.js';

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;

    this.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      this.prisma.$on('query', (e) => {
        logger.debug('Query: ' + e.query);
        logger.debug('Params: ' + e.params);
        logger.debug('Duration: ' + e.duration + 'ms');
      });
    }

    // Log errors
    this.prisma.$on('error', (e) => {
      logger.error('Prisma Error:', e);
    });
  }

  /**
   * Connect to the database
   */
  async connect() {
    try {
      await this.prisma.$connect();
      logger.info('Connected to database');
    } catch (error) {
      logger.error('Database connection error:', error);
      process.exit(1);
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info('Disconnected from database');
    } catch (error) {
      logger.error('Database disconnection error:', error);
    }
  }

  /**
   * Get Prisma client instance
   */
  getClient() {
    return this.prisma;
  }
}

// Export singleton instance
const database = new Database();
export default database; 