const Redis = require('ioredis');
const logger = require('./logger');

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;

// Create ioredis client
const redisConnection = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
  enableOfflineQueue: false, // Prevents commands from queuing and hanging when offline
  // Upstash requires TLS for public connections. We check the hostname or env flag.
  ...(redisHost.includes('upstash.io') || process.env.REDIS_TLS === 'true' ? { tls: {} } : {})
});

let isConnected = false;

redisConnection.on('error', (error) => {
  logger.error(`Redis queue connection failed: ${error.message}`);
});

redisConnection.on('connect', () => {
  isConnected = true;
  logger.info('Redis queue connection established successfully.');
});

redisConnection.on('close', () => {
  isConnected = false;
});

// In-memory fallback cache for when Redis is offline
const memoryCache = new Map();

// Save references to original methods
const originalSet = redisConnection.set.bind(redisConnection);
const originalGet = redisConnection.get.bind(redisConnection);
const originalDel = redisConnection.del.bind(redisConnection);

// Override set method
redisConnection.set = async (key, value, expiryMode, time, ...args) => {
  if (isConnected) {
    try {
      return await originalSet(key, value, expiryMode, time, ...args);
    } catch (err) {
      logger.warn(`Redis SET failed, falling back to memory: ${err.message}`);
    }
  }
  
  // Memory fallback
  memoryCache.set(key, value);
  if (expiryMode === 'EX' && time) {
    const timeNum = Number(time);
    if (!isNaN(timeNum)) {
      setTimeout(() => {
        memoryCache.delete(key);
      }, timeNum * 1000);
    }
  }
  logger.info(`[Memory Fallback] Stored key: ${key}`);
  return 'OK';
};

// Override get method
redisConnection.get = async (key, ...args) => {
  if (isConnected) {
    try {
      return await originalGet(key, ...args);
    } catch (err) {
      logger.warn(`Redis GET failed, falling back to memory: ${err.message}`);
    }
  }
  
  logger.info(`[Memory Fallback] Retrieved key: ${key}`);
  const val = memoryCache.get(key);
  return val === undefined ? null : val;
};

// Override del method
redisConnection.del = async (key, ...args) => {
  if (isConnected) {
    try {
      return await originalDel(key, ...args);
    } catch (err) {
      logger.warn(`Redis DEL failed, falling back to memory: ${err.message}`);
    }
  }
  
  logger.info(`[Memory Fallback] Deleted key: ${key}`);
  return memoryCache.delete(key) ? 1 : 0;
};

module.exports = redisConnection;
