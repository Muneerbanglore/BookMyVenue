const path = require('path');
const userService = require('../services/user.service');
const { formatSuccess } = require('../utils/formatters');
const asyncHandler = require('../utils/asyncHandler');
const HttpStatusCodes = require('../constants/httpStatusCodes');
const { BadRequestError } = require('../utils/errors');

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('User profile data retrieved successfully.', { user }));
});

/**
 * @desc    Update user profile data
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('User profile data updated successfully.', { user: updatedUser }));
});

/**
 * @desc    Upload profile picture for regular user
 * @route   POST /api/v1/users/profile/images
 * @access  Private (Multipart)
 */
const uploadProfileImages = asyncHandler(async (req, res) => {
  const section = req.body.section || req.query.section;

  if (section !== 'profile_image') {
    throw new BadRequestError('Users can only upload a profile image under the section "profile_image".', 'VALIDATION_FAILED');
  }

  if (!req.files || req.files.length === 0) {
    throw new BadRequestError('No image files provided for upload.', 'VALIDATION_FAILED');
  }

  const file = req.files[0];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}_profile${fileExtension}`;
  const destPath = `users/${req.user.id}/profile_image/${fileName}`;

  // Upload to Firebase Storage
  const admin = require('firebase-admin');
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;
  const bucket = admin.storage().bucket(storageBucket);
  const storageFile = bucket.file(destPath);

  const crypto = require('crypto');
  const downloadToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  await storageFile.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
    resumable: false,
  });

  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destPath)}?alt=media&token=${downloadToken}`;

  // Update URL in users collection
  const User = require('../schemas/user.schema');
  let user = await User.findById(req.user.id);
  if (!user) {
    user = new User({ _id: req.user.id });
  }
  user.profile_image = publicUrl;
  await user.save();

  res.status(HttpStatusCodes.OK).json(
    formatSuccess('Profile image uploaded successfully.', { imageUrl: publicUrl })
  );
});

/**
 * @desc    Run heavy calculation on an isolated Worker Thread
 * @route   POST /api/v1/users/heavy-task
 * @access  Private (Admin only)
 */
const triggerHeavyTask = asyncHandler(async (req, res) => {
  const iterations = parseInt(req.body.iterations, 10) || 50000000;
  const result = await userService.runHeavyCalculation(iterations);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('Heavy CPU task completed on Worker Thread.', result));
});

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImages,
  triggerHeavyTask,
};
