const User = require('../models/User');

const Instagram = require('node-instagram').default;


const getMediaFromInstagram = (req, res, next) => {
  const userId = req.params.id;
  //const tag = req.query.tag; - new release

  User
    .find({
        _id: userId
      },
      {'_id': 0, 'instagramAccessToken': 1}
    )
    .lean().exec( (err, result) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {
      if (Object.keys(result[0]).length === 0 && result[0].constructor === Object) {
        res.status(200).json([]);
      } else {
        const instagram = new Instagram({
          clientId: '2286b1bb3e7d4715a9fb028ae2bd3ea2',
          clientSecret: '7da219767f6c4e548974d8dd2a2049fc',
          accessToken: result[0].instagramAccessToken
        });

        instagram.get('users/self/media/recent').then(data => {
          if (data.data.length < 1) {
            res.status(200).json(data.data);
          } else {
            const userImagesUrls = data.data.map(val => {
              return val.images.standard_resolution.url;
            });
            res.status(200).json(userImagesUrls);
          }
        });

      }

    }
  });



};

module.exports = getMediaFromInstagram;
