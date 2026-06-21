const { Worker } = require('worker_threads');
const path = require('path');
const User = require('../schemas/user.schema');
const Member = require('../schemas/member.schema');
const { encodeGeohash } = require('../utils/geohash');
const cryptoUtils = require('../utils/crypto');
const { NotFoundError, AppError } = require('../utils/errors');
const ErrorCodes = require('../constants/errorCodes');
const logger = require('../config/logger');

/**
 * Retrieve user profile and merge with member credentials
 * @param {string} id - User/Member ID
 */
const getUserById = async (id) => {
  const member = await Member.findById(id);
  if (!member) {
    throw new NotFoundError('Member account not found.', ErrorCodes.USER_NOT_FOUND);
  }

  let user = await User.findById(id);
  if (!user) {
    // Return skeleton profile populated from Member
    user = new User({
      _id: id,
      first_name: '',
      last_name: '',
      profile_image: '',
      role_id: 2
    });
  }

  return {
    id: user.id,
    email: member.email_id,
    phone_number: member.phone_number ? `+${member.phone_number}` : '',
    first_name: user.first_name,
    last_name: user.last_name,
    profile_image: user.profile_image,
    role_id: user.role_id,
    dob: user.dob,
    gender: user.gender,
    location: user.location,
    preferences: user.preferences,
    createdAt: user.createdAt || member.createdAt,
    updatedAt: user.updatedAt || member.updatedAt
  };
};

/**
 * Update user details and synchronize with member record
 * @param {string} id - User/Member ID
 * @param {Object} updateData - Key-values to update
 */
const updateUserProfile = async (id, updateData) => {
  const member = await Member.findById(id);
  if (!member) {
    throw new NotFoundError('Member account not found.', ErrorCodes.USER_NOT_FOUND);
  }

  let user = await User.findById(id);
  if (!user) {
    user = new User({ _id: id });
  }

  // Update properties if provided
  if (updateData.firstName !== undefined) user.first_name = updateData.firstName;
  if (updateData.lastName !== undefined) user.last_name = updateData.lastName;
  if (updateData.dob !== undefined) user.dob = updateData.dob;
  if (updateData.gender !== undefined) user.gender = updateData.gender;
  if (updateData.preferences !== undefined) {
    user.preferences = {
      ...user.preferences,
      ...updateData.preferences
    };
  }

  // Update location and handle geohashing if coordinates provided
  if (updateData.location !== undefined) {
    user.location = {
      ...user.location,
      ...updateData.location
    };

    if (updateData.location.coordinates) {
      const { latitude, longitude } = updateData.location.coordinates;
      user.location.geohash = encodeGeohash(latitude, longitude, 9);
    }
  }

  // Handle password update if provided
  if (updateData.password) {
    const hashedPassword = await cryptoUtils.hashPassword(updateData.password);
    member.credentials.password = hashedPassword;
  }

  // Sync name details with member identifier
  if (updateData.firstName !== undefined || updateData.lastName !== undefined) {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const identifier = `${firstName}_${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/^_+|_+$/g, ''); // Trim leading/trailing underscores
    
    if (identifier) {
      member.identifier = identifier;
    }
  }

  // Save changes to Firestore
  await user.save();
  await member.save();

  // Return the unified profile
  return getUserById(id);
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
  runHeavyCalculation
};
