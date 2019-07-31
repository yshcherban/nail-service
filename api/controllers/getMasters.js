const User = require('../models/User');

const getMasters = (req, res, next) => {
  User.find({'role':'master'}).lean().exec( (err, clients) => {
    return res.status(200).json(clients);
  });
};

module.exports = getMasters;
