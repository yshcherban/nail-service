const User = require('../models/User');
const Otp = require('../models/Otp');

const freezeUser = (req, res, next) => {
  const userId = req.params.userId;

  User
      .findById({ '_id': userId }, {'phone': 1})
      .lean()
      .exec( (err, user) => {
        Otp.updateOne({phone: user.phone}, {
          $set: {
            "phoneBlocked": 1,
          }
        }, (err, result) => {
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
                message: "User was banned"
              });
            }
          });
        })

      });

};

module.exports = freezeUser;
