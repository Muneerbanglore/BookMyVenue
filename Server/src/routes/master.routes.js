const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboarding.controller');

// GET master data dropdowns for onboarding
router.get('/onboarding', onboardingController.getOnboardingDropdowns);
router.get('/onboarding/dropdown', onboardingController.getOnboardingDropdowns);

module.exports = router;
