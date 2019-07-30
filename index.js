require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./api/routes')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
