const User = require('../models/User');
const path = require('path');

const updateUserFields = (req, res, next) => {
  const userId = req.params.id;
  const body = req.body;

  if (req.file) {
    const coverImgPath = req.file.path.split(path.sep).slice(1).join('/');
    const cover = {
      cover: coverImgPath
    };

    const updateObj = Object.assign(body, cover);

    User.findByIdAndUpdate(userId, updateObj, {
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

  } else {
    User.findByIdAndUpdate(userId, body, {
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
};

module.exports = updateUserFields;
