const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');

// Login existing user
router.post('/login', validate(loginSchema), authController.login);

// Refresh access tokens
router.post('/refresh', authController.refresh);

// Logout session
router.post('/logout', authController.logout);

module.exports = router;
