const express = require('express')
const router = express.Router();
const { getLocationInfo } = require('../controllers');

// Get address coordinates and address
router.get('/location', (req, res, next) => {
  getLocationInfo(req, res, next);
});

module.exports = router;
