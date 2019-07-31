const User = require('../models/User');

const createUser = (req, res, next) => {
  const user = new User(req.body);

  user.save(function (err) {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json({
        message: "User successfully created"
      });
    }
  });
};

module.exports = createUser;
