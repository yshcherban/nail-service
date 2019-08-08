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

    Otp
      .find({phone: phoneNumber})
      .lean().exec( (err, result) => {
      if (err) {
        res.status(400).json({
          message: err.message
        });
      } else {
        if(result.length !== 0) {
          if (result[0].phoneBlocked) {
            res.status(400).json({
              message: "Your account has been blocked."
            });
          }

          const currentDate = new Date().getTime();

          const updatedDate = result[0].updated_at;
          updatedDate.setMinutes( updatedDate.getMinutes() + 1 );
          const timeDatabase = updatedDate.getTime();

          if (currentDate >= timeDatabase) {
            console.log('proceed');
          } else {
            res.status(400).json({
              message: `Please wait 1 minute and try again`
            });
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
              res.status(200).json({
                message: "Otp successfully sent"
              });
            }
          });


        }
      }
    });







    // send_sms({
    //     phones : phoneNumber,
    //     mes : `Ваш код: ${generateFourDigits()}`,
    // }, function (data, raw, err, code) {
    //     if (err) return console.log(err, 'code: '+code);
    //     console.log(data); // object
    //     console.log(raw); // string in JSON format
    // });

  } else {
    res.status(400).json({
      message: "Phone must contains only digits"
    });
  }

};

module.exports = sendSmsCode;





// Отправка SMS
// smsc.send_sms({
//     phones : ['79999999999', '79999999999'],
//     mes : 'Привет!',
//     cost : 1
// }, function (data, raw, err, code) {
//     if (err) return console.log(err, 'code: '+code);
//     console.log(data); // object
//     console.log(raw); // string in JSON format
// });
//
// // Получение баланса
// smsc.get_balance(function (balance, raw, err, code) {
// if (err) return console.log(err, 'code: '+code);
//     console.log(balance);
// });
//
// // Получение статуса сообщений
// smsc.get_status({
//     phones : 79999999999,
//     id : 111,
//     all : 1
// }, function (status, raw, err, code) {
// if (err) return console.log(err, 'code: '+code);
//     console.log(status);
// });
