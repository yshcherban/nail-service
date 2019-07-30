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
  phone: {type: Number},
  avatar: String,
  cover: String,
  password: {type: String, required: true },
  meta: {
    votes: Number,
    testimonials: [{
      customerFirstName: {type: String},
      body: {type: String},
      date: Date
    }]
  },
  body: {type: String}
});

UserSchema.plugin(require('mongoose-role'), {
  roles: ['master', 'client', 'admin'],
  accessLevels: {
    master: ['master'],
    client: ['client'],
    admin: ['admin']
  }
});

mongoose.model('User', UserSchema);
