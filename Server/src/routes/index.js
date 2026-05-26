const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const masterRoutes = require('./master.routes');
const onboardingRoutes = require('./onboarding.routes');

// Health Check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is operational',
    timestamp: new Date().toISOString(),
  });
});

// Aggregate modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/master', masterRoutes);
router.use('/onboarding', onboardingRoutes);

module.exports = router;
