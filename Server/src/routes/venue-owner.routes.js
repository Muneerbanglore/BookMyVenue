const express = require('express');
const multer = require('multer');
const router = express.Router();
const venueOwnerController = require('../controllers/venue-owner.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  venueOwnerPhase1Schema,
  venueOwnerPhase2Schema,
  venueOwnerPhase4Schema
} = require('../validators/venue-owner.validator');
const { BadRequestError } = require('../utils/errors');

// Configure multer for memory storage file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB per image
  }
});

// All routes below require valid JWT session token and VENUE_OWNER role authorization
router.use(protect);
router.use(authorize('VENUE_OWNER'));

// Dynamic validation middleware factory depending on the requested Phase
const validatePhase = (req, res, next) => {
  const phase = req.query.phase;

  if (phase === '1') {
    return validate(venueOwnerPhase1Schema)(req, res, next);
  } else if (phase === '2') {
    return validate(venueOwnerPhase2Schema)(req, res, next);
  } else if (phase === '4') {
    return validate(venueOwnerPhase4Schema)(req, res, next);
  } else {
    return next(new BadRequestError('Query parameter "phase" must be 1, 2, or 4.', 'VALIDATION_FAILED'));
  }
};

// Retrieve and update venue owner profile
router.route('/profile')
  .get(venueOwnerController.getProfile)
  .put(validatePhase, venueOwnerController.updateProfile);

// Image/Gallery upload route section-wise (Phase 3)
router.post('/profile/images', upload.array('images', 5), venueOwnerController.uploadVenueImages);

module.exports = router;
