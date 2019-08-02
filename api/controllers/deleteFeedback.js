const User = require('../models/User');

const deleteFeedback = (req, res, next) => {
  const userId = req.params.id;
  const feedbackId = req.params.feedbackId;

  User.findByIdAndUpdate(userId, {
    $pull: {
      "meta.testimonials": {_id: feedbackId}
    }
  },(err, user) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json({
        message: "Feedback successfully removed"
      });
    }
  });
  
};

module.exports = deleteFeedback;
