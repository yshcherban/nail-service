const smsc = require('./smsc.js');

smsc.configure({
    login : 'simoncodecreator',
    password : '493e54671ab999c8fd5b9fbcb4f370ec3b7091ed',
    //ssl : true/false,
    //charset : 'utf-8',
});

// Проверка авторизации
smsc.test(function (err) {
    if (err) return console.log('error: ' + err);
    console.log('SMSc authorization success');
});


module.exports.send_sms = smsc.send_sms;
module.exports.get_balance = smsc.get_balance;
module.exports.get_status = smsc.get_status;
