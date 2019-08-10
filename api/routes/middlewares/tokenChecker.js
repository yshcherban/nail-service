const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../../models/User');

module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        } else {
          User
            .findOne(
              {phone: decoded.phone, accessToken: token},
              (err, user) => {
                if (err) {
                  res.status(400).json({
                    message: err.message
                  });
                } else {
                  if (user) {
                    req.userId = user._id;
                    next();
                  } else {
                    return res.status(401).json({"error": true, "message": 'Token expired' });
                  }
                }})
        }


    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "message": 'No token provided.'
    });
  }
}
