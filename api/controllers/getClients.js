const User = require('../models/User');

const getClients = (req, res, next) => {
  User.find({'role':'client'}).lean().exec( (err, clients) => {
    return res.status(200).json(clients);
  });
};

module.exports = getClients;
