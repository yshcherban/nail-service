const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const config = require('../routes/middlewares/config');

const login = (req, res, next) => {
  const phone = req.body.phone;
  const password = req.body.password;

  if (phone && password) {
    const regex = RegExp('^[0-9]*$');

    if(regex.test(phone)) {

      Otp
        .findOne(
          {phone: phone},
          (err, otp) => {
            if (err) {
              res.status(400).json({
                message: err.message
              });
            } else {
                // If phone and code exists in OTP
                if(otp) {
                  otp.comparePassword(password, function(err, isMatch) {
                      if (err) {
                        res.status(400).json({
                          message: "Wrong credentials"
                        });
                      } else {
                        if(isMatch) {
                          // Search user
                          User
                            .findOne(
                              {phone: phone},
                              (err, user) => {
                                if (err) {
                                  res.status(400).json({
                                    message: err.message
                                  });
                                } else {
                                  if (user) {
                                    const systemUser = {
                                      "userId": user._id,
                                      "phone": phone,
                                    };

                                    const token = jwt.sign(systemUser, config.secret, { expiresIn: config.tokenLife})
                                    const refreshToken = jwt.sign(systemUser, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})

                                    user.accessToken = token;
                                    user.refreshToken = refreshToken;
                                    user.save(function (err, user) {
                                      if (err) {
                                        res.status(400).json({
                                          message: err.message
                                        });
                                      } else {
                                        // Remove password
                                        otp.passwordCode = 'undefined'; // clear password
                                        otp.save(function (err, user) {
                                          if (err) {
                                            res.status(400).json({
                                              message: err.message
                                            });
                                          } else {
                                            res.status(200).json(user);
                                        }});
                                    }});

                                  } else {

                                    const user = new User({
                                      phone: phone,
                                      role: 'client'
                                    });

                                    user.save(function (err, user) {
                                      if (err) {
                                        res.status(400).json({
                                          message: err.message
                                        });
                                      } else {
                                        const systemUser = {
                                          "userId": user._id,
                                          "phone": phone
                                        };

                                        const token = jwt.sign(systemUser, config.secret, { expiresIn: config.tokenLife})
                                        const refreshToken = jwt.sign(systemUser, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife})

                                        user.accessToken = token;
                                        user.refreshToken = refreshToken

                                        user.save(function (err, user) {
                                          if (err) {
                                            res.status(400).json({
                                              message: err.message
                                            });
                                          } else {
                                            // Remove password
                                            otp.passwordCode = 'undefined'; // clear password
                                            otp.save(function (err, otp) {
                                              if (err) {
                                                res.status(400).json({
                                                  message: err.message
                                                });
                                              } else {
                                                res.status(200).json(user);
                                            }});
                                          }});
                                    }});

                                  }

                                }
                              });

                        } else {
                          res.status(400).json({
                            message: "Password wrong"
                          });
                        }
                      }

                  });

                } else {
                  res.status(400).json({
                    message: "User not found"
                  });
                }
            }
          })



    } else {
      res.status(400).json({
        message: "Phone must contains only digits"
      });
    }
  } else {
    res.status(400).json({
      message: "Login and Password must be provided"
    });
  }

};

module.exports = login;
