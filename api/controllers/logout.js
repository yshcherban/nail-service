const User = require('../models/User');

const logout = (req, res, next) => {
  const userId = req.userId;

  User.findByIdAndUpdate(userId, {
    $set: {
      "accessToken": "",
      "refreshToken": ""
    }
  },(err, user) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json({
        message: "You have successfully logged out"
      });
    }
  });

};

module.exports = logout;
