const express = require('express')
const router = express.Router();
const { createUser } = require('../controllers');
const { getClients } = require('../controllers');
const { getMasters } = require('../controllers');
const { updateUserFields } = require('../controllers');
const { deleteUser } = require('../controllers');

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// const cpUpload = upload.fields([
//   { cover: 'cover', maxCount: 1 },
//   { portfolio: 'portfolio', maxCount: 300 }
// ]);

router.get('/', (req, res) => {
  res.send('Nail Service v.1.0');
});

router.get('/clients', (req, res, next) => {
  getClients(req, res, next);
});

router.get('/masters', (req, res, next) => {
  getMasters(req, res, next);
});

router.put('/:id', upload.single('cover'), (req, res, next) => {
  updateUserFields(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  deleteUser(req, res, next);
});

router.get('/:id/testimonials', (req, res) => {
  console.log('Testimonials');
});

router.post('/', (req, res, next) => {
  createUser(req, res, next);
});


module.exports = router;
