const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');

// Public route to search nearby venues
router.get('/search', venueController.searchVenues);

module.exports = router;
