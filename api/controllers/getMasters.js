const User = require('../models/User');

const getMasters = (req, res, next) => {
  const skip = Number(req.query.skip);
  const limit = Number(req.query.limit);
  const sortHourlyRate = Number(req.query.sortByHourlyRate);

  const hourlyRateGt = Number(req.query.hourlyRateMin);
  const hourlyRateLt = Number(req.query.hourlyRateMax);

  let queryObj;

  if (hourlyRateGt >= 0 || hourlyRateLt > 0) {
    const gte =  hourlyRateGt >= 0  ? hourlyRateGt : 0;
    const lte = hourlyRateLt > 0 ? hourlyRateLt : 1000000;
    queryObj = {
      'role':'master',
      'hourlyRate': {$gte : gte, $lte : lte}
    };
  } else {
    queryObj = {
      'role':'master'
    };
  }



  User.find(
    queryObj,
    {'accessToken': 0, 'refreshToken': 0},
    {skip, limit,
      sort: {
        hourlyRate: sortHourlyRate
      }
    }
    )
    .lean()
    .exec( (err, masters) => {
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
