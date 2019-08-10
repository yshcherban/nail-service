const Otp = require('../models/Otp');
const { send_sms,  get_balance, get_status} = require('../../smsapi');

function generateFourDigits() {
  const digits = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  return digits;
}

const sendSmsCode = (req, res, next) => {
  const phoneNumber = req.body.phone;

  const regex = RegExp('^[0-9]*$');

  if(regex.test(phoneNumber)) {
    const passwordCode = generateFourDigits();
    console.log(passwordCode);

    Otp
      .find({phone: phoneNumber})
      .lean().exec( (err, result) => {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        if(result.length !== 0) {
          // if phone exists
          if (result[0].phoneBlocked) {
            res.status(400).json({
              message: "Your account has been blocked."
            });
          } else {
            // Update code (otp)
            const currentDate = new Date().getTime();

            const updatedDate = result[0].updated_at;
            updatedDate.setMinutes( updatedDate.getMinutes() + 1 );
            const timeDatabase = updatedDate.getTime();

            if (currentDate >= timeDatabase) {
              Otp
                .findOne(
                  {phone: phoneNumber},
                  (err, otp) => {
                    if (err) {
                      res.status(400).json({
                        message: err.message
                      });
                    } else {
                      otp.passwordCode = passwordCode;
                      otp.save(function (err) {
                        if (err) {
                          res.status(400).json({
                            message: err.message
                          });
                        } else {
                          send_sms({
                              phones : phoneNumber,
                              mes : `Ваш код: ${passwordCode}`,
                          }, function (data, raw, err, code) {
                              if (err) {
                                res.status(400).json({
                                  message: "Password has not send. Please contact site owner"
                                });
                              } else {
                                res.status(200).json({
                                  message: "New password successfully sent"
                                });
                              }
                          });
                        }
                      });
                    }
                  }
                )
            } else {
              res.status(400).json({
                message: `Please wait 1 minute and try again`
              });
            }

          }

        } else {
          // Create phone number

          const otp = new Otp({
            phone: phoneNumber,
            passwordCode: passwordCode
          });

          otp.save(function (err) {
            if (err) {
              res.status(400).json({
                message: err.message
              });
            } else {
              send_sms({
                  phones : phoneNumber,
                  mes : `Ваш код: ${passwordCode}`,
              }, function (data, raw, err, code) {
                  if (err) {
                    res.status(400).json({
                      message: "Password has not send. Please contact site owner"
                    });
                  } else {
                    res.status(200).json({
                      message: "Password successfully sent"
                    });
                  }
              });
            }
          });


        }
      }
    });

  } else {
    res.status(400).json({
      message: "Phone must contains only digits"
    });
  }

};

module.exports = sendSmsCode;
