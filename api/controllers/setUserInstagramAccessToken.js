const User = require('../models/User');

const setUserInstagramAccessToken = (req, res, next, accessToken, userId) => {
  const userIdParam = userId;
  const accessTokenParam = accessToken;

  User.findByIdAndUpdate(userIdParam, {
    instagramAccessToken: accessTokenParam
  }, {
    new: true,
  }, (err, user) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json(user);
    }
  });


};

module.exports = setUserInstagramAccessToken;
