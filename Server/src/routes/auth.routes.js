const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { loginSchema, otpLoginSchema } = require('../validators/auth.validator');

// Pre-validate login credentials and send OTP
router.post('/prevalidation', validate(loginSchema), authController.login);

// Validate OTP and complete login
router.post('/validation', validate(otpLoginSchema), authController.otpLogin);

// Refresh access tokens
router.post('/refresh', authController.refresh);

// Logout session
router.post('/logout', authController.logout);

module.exports = router;
