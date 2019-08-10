const express = require('express')
const router = express.Router();
const { getClients } = require('../controllers');
const { getMasters } = require('../controllers');
const { updateUserFields } = require('../controllers');
const { deleteUser } = require('../controllers');
const { addFeedbackToUser } = require('../controllers');
const { deleteFeedback } = require('../controllers');
const { addPhotosToPortfolio } = require('../controllers');
const { removeImageFromPortfolio } = require('../controllers');
const { getPhotosFromInstagram } = require('../controllers');
const { getMediaFromInstagram } = require('../controllers');


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

const multipleUpload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// const cpUpload = multipleUpload.fields([
//   { portfolio: 'portfolio', maxCount: 300 }
// ]);

//router.use(require('./middlewares/tokenChecker'));

// Get clients
router.get('/clients', require('./middlewares/tokenChecker'), (req, res, next) => {
  getClients(req, res, next);
});

// Get masters
router.get('/masters', require('./middlewares/tokenChecker'), (req, res, next) => {
  getMasters(req, res, next);
});

// Update user
router.put('/:id', require('./middlewares/tokenChecker'), upload.single('cover'), (req, res, next) => {
  updateUserFields(req, res, next);
});

// Delete user
router.delete('/:id', require('./middlewares/tokenChecker'), (req, res, next) => {
  deleteUser(req, res, next);
});

// Need to send to swagger
// Testimonials
router.put('/:id/testimonials', require('./middlewares/tokenChecker'), (req, res, next) => {
  addFeedbackToUser(req, res, next);
});

// Delete Feedback
router.delete('/:id/testimonials/:feedbackId', require('./middlewares/tokenChecker'), (req, res, next) => {
  deleteFeedback(req, res, next);
});

// Add images to portfolio
router.put('/:id/portfolio', require('./middlewares/tokenChecker'), multipleUpload.array('portfolio', 300), (req, res, next) => {
  addPhotosToPortfolio(req, res, next);
});

// Remove images from portfolio
router.delete('/:id/portfolio/:imageId', require('./middlewares/tokenChecker'), (req, res, next) => {
  removeImageFromPortfolio(req, res, next);
});

router.get('/:id/instagram/media', require('./middlewares/tokenChecker'), (req, res, next) => {
  getMediaFromInstagram(req, res, next);
});

// add geo and auth to swagger



module.exports = router;
