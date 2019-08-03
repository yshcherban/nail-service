const User = require('../models/User');

const removeImageFromPortfolio = (req, res, next) => {
  const userId = req.params.id;
  const imageId = req.params.imageId;

  User.findByIdAndUpdate(userId, {
    $pull: {
      "portfolio": {_id: imageId}
    }
  },(err, user) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json({
        message: "Image successfully removed from portfolio"
      });
    }
  });

};

module.exports = removeImageFromPortfolio;
