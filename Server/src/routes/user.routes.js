const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../validators/user.validator');

// All routes below require valid JWT session token
router.use(protect);

// Retrieve and update user profile
router.route('/profile')
  .get(userController.getProfile)
  .put(validate(updateProfileSchema), userController.updateProfile);

// Spawn a worker-thread task (Admin role access limitation)
router.post('/heavy-task', authorize('admin'), userController.triggerHeavyTask);

module.exports = router;
