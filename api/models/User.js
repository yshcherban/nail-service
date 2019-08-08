const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true, unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  firstName: {type: String},
  lastName: {type: String},
  phone: {
    type: String,
    required: true,
    unique: true
  },
  avatar: String,
  portfolio: [{
    _id: {type: Schema.Types.ObjectId, auto: true},
    imagePath: {type: String},
    date: Date
  }],
  cover: String,
  instagramId: String,
  password: {type: String, required: true},
  address: {
    name: {type: String},
    location: {
        type: {type: String, default: 'Point'},
        coordinates: {type: [Number], default: [0, 0]}
    }
  },
  meta: {
    votes: Number,
    testimonials: [{
      _id: {type: Schema.Types.ObjectId, auto: true},
      customerFirstName: {type: String, required: true},
      body: {type: String, required: true},
      customerId: {type: Schema.Types.ObjectId, required: true},
      customerCover: String,
      date: Date
    }]
  },
  services: [{
      _id: {type: Schema.Types.ObjectId, auto: true},
      serviceName: {
        type: String,
        enum: ['MANICURE', 'PEDICURE']
      },
      isActive: {type: Boolean}
  }],
  body: {type: String},
  hourlyRate: {
    type: Number
  },
  accessToken: String,
  refreshToken: String,
  inactive: {type: Boolean, default:0}
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

UserSchema.path('phone').validate(function (value) {
  // Your validation code here, should return bool
  const regex = RegExp('^[0-9]*$');
  return regex.test(value);
}, 'Invalid phone number');


UserSchema.pre('save', function(next) {
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword,next) {
  bcrypt.compare(candidatePassword,this.password, function(err,isMatch) {
    if(err) return next(err);
      next(null,isMatch)
    });
};

UserSchema.plugin(require('mongoose-role'), {
  roles: ['master', 'client', 'admin'],
  accessLevels: {
    master: ['master'],
    client: ['client'],
    admin: ['admin']
  }
});

module.exports = mongoose.model('User', UserSchema);
