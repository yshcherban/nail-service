const express = require('express')
const router = express.Router();
const { createUser } = require('../controllers');
const { getClients } = require('../controllers');
const { getMasters } = require('../controllers');

router.get('/', (req, res) => {
  res.send('Nail Service v.1.0');
});

router.get('/clients', (req, res, next) => {
  getClients(req, res, next);
});

router.get('/masters', (req, res, next) => {
  getMasters(req, res, next);
});

router.get('/:id', (req, res) => {
  console.log('One user');
});

router.get('/:id/testimonials', (req, res) => {
  console.log('Testimonials');
});

router.post('/', (req, res, next) => {
  createUser(req, res, next);
});


module.exports = router;
