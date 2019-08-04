const User = require('../models/User');

const getClients = (req, res, next) => {
  const skip = Number(req.query.skip);
  const limit = Number(req.query.limit);

  User
    .find({
        role: 'client'
      },
      null,
      {skip, limit}
    )
    .lean().exec( (err, clients) => {
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
