const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../validators/user.validator');

// Configure multer for memory storage file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});

// All routes below require valid JWT session token
router.use(protect);

// Retrieve and update user profile
router.route('/profile')
  .get(userController.getProfile)
  .put(validate(updateProfileSchema), userController.updateProfile);

// Upload profile image
router.post('/profile/images', upload.array('images', 5), userController.uploadProfileImages);

// Spawn a worker-thread task (Admin role access limitation)
router.post('/heavy-task', authorize('admin'), userController.triggerHeavyTask);

module.exports = router;
