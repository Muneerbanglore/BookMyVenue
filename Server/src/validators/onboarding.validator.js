const Joi = require('joi');

const onboardingSchema = Joi.object({
  authProvider: Joi.object({
    type: Joi.string().valid('GOOGLE', 'EMAIL').required().messages({
      'any.only': 'Authentication type must be GOOGLE or EMAIL',
      'any.required': 'Authentication provider type is required'
    }),
    providerId: Joi.string().required().messages({
      'any.required': 'Provider ID is required'
    }),
    idToken: Joi.string().allow('', null).optional()
  }).optional(),

  personalData: Joi.object({
    firstName: Joi.string().trim().max(50).required().messages({
      'string.empty': 'First name cannot be empty',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required'
    }),
    lastName: Joi.string().trim().max(50).required().messages({
      'string.empty': 'Last name cannot be empty',
      'string.max': 'Last name cannot exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    email: Joi.string().trim().email().required().messages({
      'string.email': 'The email address format is invalid.',
      'string.empty': 'Email address cannot be empty',
      'any.required': 'Email address is required'
    }),
    phoneNumber: Joi.string().trim().required().messages({
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is required'
    })
  }).required().messages({
    'any.required': 'Personal data is required'
  }),

  verificationStatus: Joi.object({
    isEmailVerified: Joi.boolean().required(),
    isPhoneVerified: Joi.boolean().required(),
    verificationChannel: Joi.string().valid('OTP', 'LINK', 'NONE').required()
  }).optional(),

  role_id: Joi.number().valid(2, 3).optional(),
  role: Joi.alternatives().try(
    Joi.string().valid('VENUE_OWNER', 'USER', 'ADMIN'),
    Joi.object({
      id: Joi.string().valid('VENUE_OWNER', 'USER', 'ADMIN').required()
    }).unknown()
  ).optional(),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters long'
  })
});

module.exports = {
  onboardingSchema
};
