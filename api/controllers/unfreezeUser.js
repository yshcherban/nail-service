const User = require('../models/User');
const Otp = require('../models/Otp');

const unfreezeUser = (req, res, next) => {
  const userId = req.params.userId;

  User
      .findById({ '_id': userId }, {'phone': 1})
      .lean()
      .exec( (err, user) => {
        Otp.updateOne({phone: user.phone}, {
          $set: {
            "phoneBlocked": 0,
          }
        }, (err, result) => {
          res.status(200).json({
            message: "User alive now again"
          });
        })

      });

};

module.exports = unfreezeUser;
