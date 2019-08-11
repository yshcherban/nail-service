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
  instagramAccessToken: {
    type: String,
    unique: true
  },
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
      categoryName: {
        type: String,
        enum: ['MANICURE', 'PEDICURE', 'COVER', 'STRENGTHENING', 'DESIGN']
      },
      categoryItems: [{
        categoryName: {
          type: String,
          enum: ['MANICURE', 'PEDICURE', 'COVER', 'STRENGTHENING', 'DESIGN']
        },
        itemId: {type: Schema.Types.ObjectId, auto: true},
        itemName: {type: String},
        isActive: {type: Boolean}
      }],
      isActive: {type: Boolean}
  }],
  body: {type: String},
  hourlyRate: {
    type: Number
  },
  accessToken: String,
  refreshToken: String
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

UserSchema.path('phone').validate(function (value) {
  // Your validation code here, should return bool
  const regex = RegExp('^[0-9]*$');
  return regex.test(value);
}, 'Invalid phone number');


UserSchema.plugin(require('mongoose-role'), {
  roles: ['master', 'client'],
  accessLevels: {
    master: ['master'],
    client: ['client']
  }
});

module.exports = mongoose.model('User', UserSchema);
