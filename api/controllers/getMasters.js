const User = require('../models/User');

const getMasters = (req, res, next) => {
  User.find({'role':'master'}).lean().exec( (err, masters) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json(masters);
    }
  });
};

module.exports = getMasters;
