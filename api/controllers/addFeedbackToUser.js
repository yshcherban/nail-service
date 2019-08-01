const User = require('../models/User');

const addFeedbackToUser = (req, res, next) => {
  const userId = req.params.id;
  // Now - only one feedback can be given at one time
  const customerId = req.body.meta.testimonials[0].customerId;
  const feedback = req.body.meta.testimonials[0].body;

  User.findById(customerId, { '_id': 1, firstName: 1, cover: 1}).lean().exec( (err, customerFields) => {
    if (err) {
      res.status(400).json({
        message: err.message
      });
    } else {

      const customerDataObj = {
        customerFirstName: customerFields.firstName,
        body: feedback,
        customerId: customerFields._id,
      };

      const customerDataObjToSend = customerFields.cover
        ? Object.assign(customerDataObj, {customerCover: customerFields.cover})
        : customerDataObj;


      User.findByIdAndUpdate(userId, {
       $push: {
         "meta.testimonials": customerDataObjToSend
       }
      }, {
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


  });


};

module.exports = addFeedbackToUser;
