const express = require('express')
const router = express.Router();
const { sendSmsCode } = require('../controllers');

router.post('/', (req, res, next) => {
  sendSmsCode(req, res, next);
});

module.exports = router;
