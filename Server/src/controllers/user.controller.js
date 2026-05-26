const userService = require('../services/user.service');
const { formatSuccess } = require('../utils/formatters');
const asyncHandler = require('../utils/asyncHandler');
const HttpStatusCodes = require('../constants/httpStatusCodes');

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
  triggerHeavyTask,
};
