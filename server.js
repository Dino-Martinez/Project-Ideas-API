require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());

require('./data/db');

const checkAuth = (req, res, next) => {
  if (typeof req.cookies.user_token === 'undefined' || req.cookies.user_token === null) {
    req.user = null;
  } else {
    const token = req.cookies.user_token;
    const decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

require('./controllers/auth.js')(app);
require('./controllers/projects.js')(app);

app.listen(3000, () => {
  console.log('API listening on port http://localhost:3000!');
});

module.exports = app;
