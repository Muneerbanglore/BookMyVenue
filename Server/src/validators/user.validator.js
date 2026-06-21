const Joi = require('joi');

/**
 * Validator schema for regular user profile update
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'First name cannot exceed 50 characters'
    }),
  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  dob: Joi.string()
    .trim()
    .isoDate()
    .optional()
    .messages({
      'string.isoDate': 'Date of birth must be a valid ISO Date (YYYY-MM-DD)'
    }),
  gender: Joi.string()
    .valid('male', 'female', 'other')
    .optional(),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    }),
  location: Joi.object({
    address: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    postalCode: Joi.string().trim().optional(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
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
  updateProfileSchema
};
