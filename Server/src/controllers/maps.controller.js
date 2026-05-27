const { BadRequestError, AppError } = require('../utils/errors');
const asyncHandler = require('../utils/asyncHandler');
const ErrorCodes = require('../constants/errorCodes');
const logger = require('../config/logger');

const getApiKey = () => {
  const apiKey = process.env.Google_Map_Api;
  if (!apiKey) {
    throw new AppError(
      'Google Maps API Key is not configured on the server.',
      500,
      ErrorCodes.INTERNAL_SERVER_ERROR
    );
  }
  return apiKey;
};

/**
 * @desc    Proxy request to Google Places Autocomplete API
 * @route   GET /api/v1/maps/places/autocomplete
 * @access  Public
 */
const autocomplete = asyncHandler(async (req, res) => {
  const { input } = req.query;

  if (!input) {
    throw new BadRequestError('Search query input parameter is required.', 'VALIDATION_FAILED');
  }

  const apiKey = getApiKey();
  const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  logger.debug(`Proxying request to Google Places Autocomplete for input: "${input}"`);

  const response = await fetch(googleUrl);
  const data = await response.json();

  res.status(response.status).json(data);
});

/**
 * @desc    Proxy request to Google Place Details API to get coordinates/address
 * @route   GET /api/v1/maps/places/details
 * @access  Public
 */
const placeDetails = asyncHandler(async (req, res) => {
  const { placeId } = req.query;

  if (!placeId) {
    throw new BadRequestError('Place ID parameter is required.', 'VALIDATION_FAILED');
  }

  const apiKey = getApiKey();
  const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
    placeId
  )}&key=${apiKey}`;

  logger.debug(`Proxying request to Google Place Details for placeId: "${placeId}"`);

  const response = await fetch(googleUrl);
  const data = await response.json();

  res.status(response.status).json(data);
});

/**
 * @desc    Proxy request to Google Directions API
 * @route   GET /api/v1/maps/directions
 * @access  Public
 */
const directions = asyncHandler(async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    throw new BadRequestError(
      'Both origin and destination parameters are required.',
      'VALIDATION_FAILED'
    );
  }

  const apiKey = getApiKey();
  const googleUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

  logger.debug(`Proxying request to Google Directions from "${origin}" to "${destination}"`);

  const response = await fetch(googleUrl);
  const data = await response.json();

  res.status(response.status).json(data);
});

/**
 * @desc    Proxy request to Google Geocoding API (address to coords or vice-versa)
 * @route   GET /api/v1/maps/geocode
 * @access  Public
 */
const geocode = asyncHandler(async (req, res) => {
  const { address, latlng } = req.query;

  if (!address && !latlng) {
    throw new BadRequestError(
      'Either address or latlng coordinate parameter is required.',
      'VALIDATION_FAILED'
    );
  }

  const apiKey = getApiKey();
  let queryParam = '';

  if (address) {
    queryParam = `address=${encodeURIComponent(address)}`;
  } else {
    queryParam = `latlng=${encodeURIComponent(latlng)}`;
  }

  const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?${queryParam}&key=${apiKey}`;

  logger.debug(`Proxying request to Google Geocoding for parameters: "${queryParam}"`);

  const response = await fetch(googleUrl);
  const data = await response.json();

  res.status(response.status).json(data);
});

module.exports = {
  autocomplete,
  placeDetails,
  directions,
  geocode,
};
