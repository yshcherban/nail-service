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
          jwt.verify(token, config.refreshTokenSecret, function(err, decoded) {
              if (err) {
                return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
              } else {
                User
                  .findOne(
                    {_id: decoded.userId, phone: decoded.phone, refreshToken: token},
                    (err, user) => {
                      if (err) {
                        res.status(400).json({
                          message: err.message
                        });
                      } else {

                        if (user) {
                          if (user._id.toString() === decoded.userId.toString()) {
                            req.userId = user._id;
                            req.refreshToken = token;
                            next();
                          } else {
                            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
                          }
                        } else {
                          return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
                        }

                      }
                    });
              }}
          )
        } else {
          User
            .findOne(
              {_id: decoded.userId, phone: decoded.phone, accessToken: token},
              (err, user) => {
                if (err) {
                  res.status(400).json({
                    message: err.message
                  });
                } else {
                  if (user) {
                    if (user._id.toString() === decoded.userId.toString()) {
                      req.userId = user._id;
                      next();
                    } else {
                      return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
                    }
                  } else {
                    return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
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
