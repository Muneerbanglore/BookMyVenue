const Joi = require('joi');
const venueService = require('../services/venue.service');
const { formatSuccess } = require('../utils/formatters');
const asyncHandler = require('../utils/asyncHandler');
const HttpStatusCodes = require('../constants/httpStatusCodes');
const { BadRequestError } = require('../utils/errors');

const searchSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required()
    .messages({
      'any.required': 'Latitude is required',
      'number.base': 'Latitude must be a valid number',
      'number.min': 'Latitude must be at least -90',
      'number.max': 'Latitude cannot exceed 90'
    }),
  longitude: Joi.number().min(-180).max(180).required()
    .messages({
      'any.required': 'Longitude is required',
      'number.base': 'Longitude must be a valid number',
      'number.min': 'Longitude must be at least -180',
      'number.max': 'Longitude cannot exceed 180'
    }),
  radius: Joi.number().positive().optional().default(10)
    .messages({
      'number.base': 'Radius must be a valid number',
      'number.positive': 'Radius must be a positive number'
    }),
  limit: Joi.number().integer().positive().optional().default(20)
    .messages({
      'number.base': 'Limit must be a valid number',
      'number.integer': 'Limit must be an integer',
      'number.positive': 'Limit must be a positive number'
    })
});

/**
 * @desc    Search venues within a kilometer radius around a geo-point
 * @route   GET /api/v1/venues/search
 * @access  Public
 */
const searchVenues = asyncHandler(async (req, res) => {
  const { error, value } = searchSchema.validate(req.query, { abortEarly: false });

  if (error) {
    const details = error.details.map(d => d.message).join(', ');
    throw new BadRequestError(details, 'VALIDATION_FAILED');
  }

  const { latitude, longitude, radius, limit } = value;

  const venues = await venueService.searchNearbyVenues(latitude, longitude, radius, limit);

  res
    .status(HttpStatusCodes.OK)
    .json(formatSuccess('Nearby venues retrieved successfully.', {
      center: { latitude, longitude },
      radiusInKm: radius,
      count: venues.length,
      venues
    }));
});

module.exports = {
  searchVenues
};
