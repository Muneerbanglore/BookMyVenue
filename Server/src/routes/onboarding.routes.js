const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboarding.controller');
const validate = require('../middlewares/validate.middleware');
const { onboardingSchema } = require('../validators/onboarding.validator');

// Onboarding payload verification (pre-validation)
router.post('/pre-validate', validate(onboardingSchema), onboardingController.preValidate);

// Main onboarding user register endpoint
router.post('/user/create_account', validate(onboardingSchema), onboardingController.createAccount);

// OTP Verification endpoints
router.post('/otp/send', onboardingController.sendOTP);
router.post('/otp/verify', onboardingController.verifyOTP);

module.exports = router;
