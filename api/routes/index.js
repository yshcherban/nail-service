const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

// Routes
const users = require('./users');
const geo = require('./geo');
const auth = require('./auth');
const sms = require('./sms');
const admin = require('./admin');


module.exports = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/users', users);
  app.use('/api', geo);
  app.use('/api/auth', auth);
  app.use('/api/sms', sms);
  app.use('/api/jezinka', admin);
};
