const User = require('../models/User');
const Portfolio = require('../models/User');
const path = require('path');

const PortfolioLimitImages = 300;


const addPhotosToPortfolio = (req, res, next) => {
  const userId = req.params.id;
  const files = req.files;

  const imagePaths = files.map(files => {
    return files.path;
  }).map(pathToFile => {
    return pathToFile.split(path.sep).slice(1).join('/');
  });

  const arrQueriesObj = imagePaths.map(path => {
    return {
      "imagePath": path
    }
  });



  const query = (imgPaths) => {
    return new Promise(function(resolve, reject) {
      User.aggregate(
        [{$project: {
            _id: userId,
            portfolio: {$size: '$portfolio'}
        }}],
        function(err, docs) {
          if (docs[0].portfolio >= PortfolioLimitImages) {
            reject(
              new Error('Max portfolio items must be <= 5')
            );
          } else {
            User.findByIdAndUpdate(userId,  {
             $push: {
               "portfolio": {
                 $each: imgPaths
               }
             }
           }, {
             new: true
           }, (err, user) => {
              if (err) {
                reject(err);
              } else {
                console.log(user);
                resolve(user);
              }
            });
          }
        }
      );
    });
  };

  return query(arrQueriesObj).then(result => {
    return res.status(200).json(result);
  }).catch(err => {
    return res.status(400).json({
      message: err.message
    });
  });

};

module.exports = addPhotosToPortfolio;
