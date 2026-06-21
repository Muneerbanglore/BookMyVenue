const path = require('path');
const venueOwnerService = require('../services/venue-owner.service');
const { formatSuccess } = require('../utils/formatters');
const asyncHandler = require('../utils/asyncHandler');
const HttpStatusCodes = require('../constants/httpStatusCodes');
const { BadRequestError } = require('../utils/errors');

/**
 * @desc    Get currently logged-in venue owner profile
 * @route   GET /api/v1/venue-owners/profile
 * @access  Private (Venue Owner role check)
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await venueOwnerService.getVenueOwnerById(req.user.id);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('Venue owner profile data retrieved successfully.', { venueOwner: profile }));
});

/**
 * @desc    Update venue owner profile phase-by-phase
 * @route   PUT /api/v1/venue-owners/profile
 * @access  Private (Venue Owner role check)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const phase = req.query.phase;

  if (!phase) {
    throw new BadRequestError('Query parameter "phase" is required.', 'VALIDATION_FAILED');
  }

  const updatedProfile = await venueOwnerService.updateVenueOwnerProfile(req.user.id, req.body, phase);
  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('Venue owner profile data updated successfully.', { venueOwner: updatedProfile }));
});

/**
 * @desc    Upload venue images section-wise to Firebase Storage
 * @route   POST /api/v1/venue-owners/profile/images
 * @access  Private (Venue Owner role check, Multipart)
 */
const uploadVenueImages = asyncHandler(async (req, res) => {
  const section = req.body.section || req.query.section;

  const validSections = ['main_image', 'interior', 'exterior', 'facilities'];
  if (!section || !validSections.includes(section)) {
    throw new BadRequestError('A valid upload section ("main_image", "interior", "exterior", "facilities") must be specified.', 'VALIDATION_FAILED');
  }

  if (!req.files || req.files.length === 0) {
    throw new BadRequestError('No image files provided for upload.', 'VALIDATION_FAILED');
  }

  const VenueOwner = require('../schemas/venue_owner.schema');
  let owner = await VenueOwner.findById(req.user.id);
  if (!owner) {
    owner = new VenueOwner({ _id: req.user.id });
  }

  // Get current images list for validation
  const existingUrls = (section === 'main_image')
    ? (owner.main_image ? [owner.main_image] : [])
    : (owner.images && owner.images[section]) || [];

  const totalFilesCount = existingUrls.length + req.files.length;
  const limit = (section === 'main_image') ? 1 : (section === 'facilities' ? 5 : 3);

  if (totalFilesCount > limit) {
    throw new BadRequestError(`Cannot upload images. Section "${section}" is limited to a maximum of ${limit} images. Current count: ${existingUrls.length}, attempted: ${req.files.length}.`, 'VALIDATION_FAILED');
  }

  // Upload to Firebase Storage
  const admin = require('firebase-admin');
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;
  const bucket = admin.storage().bucket(storageBucket);

  const uploadedUrls = [];

  for (const file of req.files) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}_${Math.floor(100 + Math.random() * 900)}${fileExtension}`;
    const destPath = `venues/${req.user.id}/${section}/${fileName}`;

    const storageFile = bucket.file(destPath);
    await storageFile.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destPath)}?alt=media`;
    uploadedUrls.push(publicUrl);
  }

  // Save to database
  if (section === 'main_image') {
    owner.main_image = uploadedUrls[0];
  } else {
    if (!owner.images) {
      owner.images = { interior: [], exterior: [], facilities: [] };
    }
    owner.images[section] = [...existingUrls, ...uploadedUrls];
  }

  await owner.save();

  res.status(HttpStatusCodes.OK).json(
    formatSuccess('Venue images uploaded and updated successfully.', {
      section,
      imageUrls: (section === 'main_image') ? [owner.main_image] : owner.images[section],
    })
  );
});

module.exports = {
  getProfile,
  updateProfile,
  uploadVenueImages,
};
