// Routes
const users = require('./users');

module.exports = (app) => {
  app.use('/api/users', users);
};
