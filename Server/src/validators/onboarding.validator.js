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

  location: Joi.object({
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required().messages({
        'number.min': 'Latitude must be a valid coordinate between -90 and 90.',
        'number.max': 'Latitude must be a valid coordinate between -90 and 90.',
        'any.required': 'Latitude coordinates are required'
      }),
      longitude: Joi.number().min(-180).max(180).required().messages({
        'number.min': 'Longitude must be a valid coordinate between -180 and 180.',
        'number.max': 'Longitude must be a valid coordinate between -180 and 180.',
        'any.required': 'Longitude coordinates are required'
      })
    }).required(),
    metadata: Joi.object({
      country: Joi.string().required().messages({
        'any.required': 'Country is a required field.'
      }),
      city: Joi.string().required().messages({
        'any.required': 'City is a required field.'
      }),
      state: Joi.string().required().messages({
        'any.required': 'State is a required field.'
      }),
      postalCode: Joi.string().required().messages({
        'any.required': 'Postal code is a required field.'
      }),
      timezone: Joi.string().required().messages({
        'any.required': 'Timezone is a required field.'
      }),
      locale: Joi.string().required().messages({
        'any.required': 'Locale is a required field.'
      })
    }).required()
  }).optional(),

  verificationStatus: Joi.object({
    isEmailVerified: Joi.boolean().required(),
    isPhoneVerified: Joi.boolean().required(),
    verificationChannel: Joi.string().valid('OTP', 'LINK', 'NONE').required()
  }).optional(),

  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark').required().messages({
      'any.only': 'Theme must be light or dark'
    }),
    notifications: Joi.object({
      email: Joi.boolean().required(),
      sms: Joi.boolean().required(),
      push: Joi.boolean().required()
    }).required(),
    currency: Joi.string().required().messages({
      'any.required': 'Currency is a required field.'
    }),
    marketingConsent: Joi.boolean().required()
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
