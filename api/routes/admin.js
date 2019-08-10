const express = require('express')
const router = express.Router();
const { freezeUser } = require('../controllers');
const { unfreezeUser } = require('../controllers');

// Get address coordinates and address
router.put('/freeze/:userId', (req, res, next) => {
  freezeUser(req, res, next);
});

router.put('/unfreeze/:userId', (req, res, next) => {
  unfreezeUser(req, res, next);
});

module.exports = router;
