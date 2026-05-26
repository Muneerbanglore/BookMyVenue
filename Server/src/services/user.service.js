const { Worker } = require('worker_threads');
const path = require('path');
const User = require('../models/user.model');
const { NotFoundError, AppError } = require('../utils/errors');
const ErrorCodes = require('../constants/errorCodes');
const logger = require('../config/logger');

/**
 * Retrieve user profile by MongoDB ObjectId
 * @param {string} id - User ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User profile not found.', ErrorCodes.USER_NOT_FOUND);
  }
  return user;
};

/**
 * Update user details (e.g. name, email, password)
 * @param {string} id - User ID
 * @param {Object} updateData - Key-values to update
 */
const updateUserProfile = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User profile not found.', ErrorCodes.USER_NOT_FOUND);
  }

  // Apply changes
  if (updateData.name) user.name = updateData.name;
  if (updateData.email) user.email = updateData.email;
  if (updateData.password) user.password = updateData.password; // Triggers password hash pre-save hook

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

/**
 * Spawns an isolated native worker thread to perform a long-running CPU computation
 * @param {number} iterations - Computational iterations
 */
const runHeavyCalculation = (iterations) => {
  return new Promise((resolve, reject) => {
    // Resolve absolute path to the worker file
    const workerPath = path.join(__dirname, '../workers/processing.worker.js');
    logger.info(`Spawning Worker Thread for CPU task (iterations: ${iterations})`);

    const worker = new Worker(workerPath);

    // Send payload data
    worker.postMessage({ iterations });

    // Handle messages
    worker.on('message', (message) => {
      if (message.success) {
        resolve(message.result);
      } else {
        reject(new AppError(message.error, 500, ErrorCodes.WORKER_ERROR));
      }
      worker.terminate();
    });

    // Handle errors
    worker.on('error', (err) => {
      logger.error(`Worker error: ${err.message}`);
      reject(new AppError(err.message, 500, ErrorCodes.WORKER_ERROR));
      worker.terminate();
    });

    // Handle exit codes
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(
          new AppError(`Worker stopped with non-zero exit code: ${code}`, 500, ErrorCodes.WORKER_ERROR)
        );
      }
    });
  });
};

module.exports = {
  getUserById,
  updateUserProfile,
  runHeavyCalculation,
};
