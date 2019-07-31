const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

// Routes
const users = require('./users');


module.exports = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/users', users);
};
