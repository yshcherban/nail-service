const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Nail Service v.1.0');
});

router.get('/:id', (req, res) => {
  console.log('One user');
});

router.get('/:id/testimonials', (req, res) => {
  console.log('Testimonials');
});



module.exports = router;
