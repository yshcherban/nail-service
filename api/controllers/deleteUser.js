const User = require('../models/User');

const deleteUser = (req, res, next) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId, err => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json({
        message: "User successfully removed"
      });
    }
  });
};

module.exports = deleteUser;
