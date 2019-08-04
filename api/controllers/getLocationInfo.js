const yandeApiKey = '3729262b-b4f2-4610-a19c-323918a18350';
const axios = require('axios');

const URL = 'https://geocode-maps.yandex.ru/1.x/';

const getLocationInfo = (req, res, next) => {
  const address = req.query.geocode;
  const preparedAddress = req.query.geocode.split(' ').join('+');

  const getParams = {
    apikey: yandeApiKey,
    format: 'json',
    geocode: preparedAddress
  };

  axios.get(URL, {
    params: getParams
  })
  .then(function (response) {
    // handle success
    const found = response
                  .data
                  .response
                  .GeoObjectCollection
                  .metaDataProperty
                  .GeocoderResponseMetaData
                  .found;

    if (found === 0) {
      res.status(200).json({
        'location': {
          'status': found
        }
      });
    } else {
      const coordinates = response
                    .data
                    .response
                    .GeoObjectCollection
                    .featureMember[0]
                    .GeoObject
                    .Point
                    .pos
                    ;


      const coordinatesToPointStandart = coordinates.split(' ').join(',');

      res.status(200).json({
        'location': {
          'status': found,
          'address': {
            name: address,
            location: {
              type: 'Point',
              coordinates: [coordinatesToPointStandart]
            }
          }
        }
      });
    }

  })
  .catch(function (error) {
    res.status(400).json({
      message: error.message
    });
  })
}

module.exports = getLocationInfo;
