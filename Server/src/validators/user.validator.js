const Joi = require('joi');

/**
 * Validator schema for profile update
 */
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Name cannot exceed 50 characters'
    }),
  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    }),
  location: Joi.object({
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).optional(),
    metadata: Joi.object({
      country: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      timezone: Joi.string().optional(),
      locale: Joi.string().optional()
    }).optional()
  }).optional(),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark').optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
      push: Joi.boolean().optional()
    }).optional(),
    currency: Joi.string().optional(),
    marketingConsent: Joi.boolean().optional()
  }).optional()
}).min(1); // At least one field must be provided for update

module.exports = {
  updateProfileSchema,
};
