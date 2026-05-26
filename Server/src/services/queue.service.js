const { Queue, Worker } = require('bullmq');
const redisConnection = require('../config/queue');
const logger = require('../config/logger');

const QUEUE_NAME = 'system-task-queue';
let taskQueue = null;
let taskWorker = null;

try {
  // Initialize task queue
  taskQueue = new Queue(QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 3, // Retry failed jobs up to 3 times
      backoff: {
        type: 'exponential',
        delay: 2000, // Wait 2s, then 4s, then 8s...
      },
      removeOnComplete: true, // Auto clean successful jobs
    },
  });

  // Initialize queue worker to consume tasks
  taskWorker = new Worker(
    QUEUE_NAME,
    async (job) => {
      logger.info(`Started job execution: ${job.name} (Job ID: ${job.id})`);

      switch (job.name) {
        case 'email_notification':
          // Simulate email sending logic
          logger.info(`Sending email notification to ${job.data.email}`);
          break;
        case 'audit_log':
          // Simulate audit logging
          logger.info(`Auditing request details for user ID: ${job.data.userId}`);
          break;
        default:
          logger.warn(`Unregistered queue task: ${job.name}`);
      }

      return { processed: true };
    },
    { connection: redisConnection }
  );

  // Monitor worker job cycles
  taskWorker.on('completed', (job) => {
    logger.info(`Job ID ${job.id} completed successfully.`);
  });

  taskWorker.on('failed', (job, error) => {
    logger.error(`Job ID ${job?.id} failed with error: ${error.message}`);
  });
} catch (error) {
  logger.error(`Could not instantiate BullMQ Queue/Worker: ${error.message}`);
}

/**
 * Push new tasks to the Redis broker queue
 * @param {string} jobName - Name identifier for the task
 * @param {Object} jobData - Arguments dictionary for the task worker
 */
const enqueueTask = async (jobName, jobData) => {
  if (!taskQueue) {
    logger.warn('Queue queue engine is uninitialized. Task execution bypassed.');
    return null;
  }
  try {
    const job = await taskQueue.add(jobName, jobData);
    logger.info(`Successfully queued task: ${jobName} (Job ID: ${job.id})`);
    return job;
  } catch (error) {
    logger.error(`Failed to push task to queue: ${error.message}`);
    throw error;
  }
};

module.exports = {
  enqueueTask,
};
