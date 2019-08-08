const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../routes/middlewares/config');

const login = (req, res, next) => {
  const phone = req.body.phone;
  const password = req.body.password;


  const regex = RegExp('^[0-9]*$');
  if(regex.test(phone)) {

    User
      .findOne({phone: phone})
      .exec( (err, clients) => {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        if (!clients) {
          const user = new User({
              phone,
              password,
              role: 'client'
          });

          user.save(function (err, user) {
            if (err) {
              res.status(400).json({
                message: err.message
              });
            } else {
              const userId = user._id;
              const token = jwt.sign({userId: userId}, config.secret, { expiresIn: config.tokenLife});
              const refreshToken = jwt.sign({userId: userId}, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife});


              User.findByIdAndUpdate(userId, {
                accessToken: token,
                refreshToken: refreshToken
              }, {
                $unset: { password: 1 },
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


            }
          });

        }

        // check password
        //res.status(200).json(clients);
      }
    });

  } else {
    res.status(400).json({
      message: "Phone must contains only digits"
    });
  }

};

module.exports = login;
