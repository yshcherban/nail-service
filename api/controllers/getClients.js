const User = require('../models/User');

const getClients = (req, res, next) => {
  User.find({'role':'client'}).lean().exec( (err, clients) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      res.status(200).json(clients);
    }
  });
};

module.exports = getClients;
