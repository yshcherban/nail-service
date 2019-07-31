require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true 
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./api/routes')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
