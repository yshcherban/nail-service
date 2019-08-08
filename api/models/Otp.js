const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  passwordCode: {type: String, required: true},
  phoneBlocked: {type: Boolean, default:0},
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

OtpSchema.path('phone').validate(function (value) {
  // Your validation code here, should return bool
  const regex = RegExp('^[0-9]*$');
  return regex.test(value);
}, 'Invalid phone number');

OtpSchema.pre('save', function(next) {
    const otp = this;
    // only hash the passwordCode if it has been modified (or is new)
    if (!otp.isModified('passwordCode')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the passwordCode using our new salt
        bcrypt.hash(otp.passwordCode, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext otp with the hashed one
            otp.passwordCode = hash;
            next();
        });
    });
});

OtpSchema.methods.comparePassword = function(candidatePassword,next) {
  bcrypt.compare(candidatePassword, this.passwordCode, function(err,isMatch) {
    if(err) return next(err);
      next(null,isMatch)
    });
};

module.exports = mongoose.model('Otp', OtpSchema);
