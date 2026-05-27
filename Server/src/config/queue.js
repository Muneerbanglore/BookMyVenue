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
  // Upstash requires TLS for public connections. We check the hostname or env flag.
  ...(redisHost.includes('upstash.io') || process.env.REDIS_TLS === 'true' ? { tls: {} } : {})
});

redisConnection.on('error', (error) => {
  logger.error(`Redis queue connection failed: ${error.message}`);
});

redisConnection.on('connect', () => {
  logger.info('Redis queue connection established successfully.');
});

module.exports = redisConnection;
