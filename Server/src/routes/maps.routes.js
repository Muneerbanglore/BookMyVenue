const express = require('express');
const router = express.Router();
const mapsController = require('../controllers/maps.controller');

// Google Places Autocomplete API proxy
router.get('/places/autocomplete', mapsController.autocomplete);

// Google Place Details API proxy
router.get('/places/details', mapsController.placeDetails);

// Google Directions API proxy
router.get('/directions', mapsController.directions);

// Google Geocoding API proxy
router.get('/geocode', mapsController.geocode);

module.exports = router;
