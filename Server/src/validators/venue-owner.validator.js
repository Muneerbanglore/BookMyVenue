const Joi = require('joi');

/**
 * Phase 1: Organization details Joi Schema
 */
const venueOwnerPhase1Schema = Joi.object({
  venue_name: Joi.string()
    .trim()
    .max(100)
    .required()
    .messages({
      'string.empty': 'Venue name is required',
      'string.max': 'Venue name cannot exceed 100 characters'
    }),
  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(''),
  established_year: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional()
    .allow(null),
  main_image: Joi.string()
    .trim()
    .uri()
    .optional()
    .allow(''),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    })
});

/**
 * Phase 2: Location details Joi Schema
 */
const venueOwnerPhase2Schema = Joi.object({
  location: Joi.object({
    address: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required()
});

/**
 * Phase 4: Venue details & Preferences Joi Schema
 */
const venueOwnerPhase4Schema = Joi.object({
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark').optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
      push: Joi.boolean().optional()
    }).optional(),
    currency: Joi.string().optional()
  }).optional(),
  
  venue_details: Joi.object({
    seatingCapacity: Joi.number().integer().min(0).optional(),
    floatingCapacity: Joi.number().integer().min(0).optional(),
    diningCapacity: Joi.number().integer().min(0).optional(),
    roomsAvailable: Joi.number().integer().min(0).optional(),
    parkingArea: Joi.string().trim().optional().allow(''),
    timing: Joi.object({
      open: Joi.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({ 'string.pattern.base': 'Open time must be in HH:MM format' }),
      close: Joi.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .optional()
        .messages({ 'string.pattern.base': 'Close time must be in HH:MM format' })
    }).optional(),
    rentalCost: Joi.string().trim().optional().allow(''),
    cancellationPolicy: Joi.string().trim().optional().allow(''),
    
    // Boolean flags and strings
    ac: Joi.boolean().optional(),
    nonAc: Joi.boolean().optional(),
    cctv: Joi.boolean().optional(),
    security: Joi.string().trim().optional().allow(''),
    wifi: Joi.boolean().optional(),
    powerBackup: Joi.boolean().optional(),
    soundSystem: Joi.boolean().optional(),
    stage: Joi.boolean().optional(),
    projector: Joi.boolean().optional(),
    inHouseCatering: Joi.boolean().optional(),
    externalCateringAllowed: Joi.boolean().optional(),
    inHouseDecoration: Joi.boolean().optional(),
    externalDecorationAllowed: Joi.boolean().optional(),
    alcoholAllowed: Joi.boolean().optional(),
    wheelchairAccessible: Joi.boolean().optional(),
    valetParking: Joi.boolean().optional(),
    kitchenAvailable: Joi.boolean().optional()
  }).optional()
});

module.exports = {
  venueOwnerPhase1Schema,
  venueOwnerPhase2Schema,
  venueOwnerPhase4Schema
};
