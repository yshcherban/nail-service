const express = require('express');
const router = express.Router();
const { login } = require('../controllers');
const { logout } = require('../controllers');
const { setUserInstagramAccessToken } = require('../controllers');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('./middlewares/config');

const Instagram = require('node-instagram').default;

const instagram = new Instagram({
  clientId: '2286b1bb3e7d4715a9fb028ae2bd3ea2',
  clientSecret: '7da219767f6c4e548974d8dd2a2049fc',
});
//http://95.214.63.131:32770
//http://127.0.0.1:3000
//const redirectUri = 'http://127.0.0.1:3000/api/auth/instagram/callback';
const redirectUri = 'http://95.214.63.131:32770/api/auth/instagram/callback';

router.get('/instagram', require('./middlewares/tokenChecker'), (req, res, next) => {
  const userId = req.query.userId;
  res.redirect(instagram.getAuthorizationUrl(
    redirectUri, {
      scope: ['basic'],
      state: userId
    },
  ));
});

router.get('/instagram/callback', require('./middlewares/tokenChecker'), async (req, res, next) => {
  try {
    const userId = req.query.state;
    const data = await instagram.authorizeUser(req.query.code, redirectUri);
    const accessToken = data.access_token;
    setUserInstagramAccessToken(req, res, next, accessToken, userId);
 } catch (err) {
    res.json(err);
 }
});

router.post('/login', (req, res, next) => {
  login(req, res, next);
});

router.post('/logout', require('./middlewares/tokenChecker'), (req, res, next) => {
  logout(req, res, next);
});

router.post('/token', require('./middlewares/tokenChecker'), (req, res, next) => {
  const userId = req.userId;
  const refreshToken = req.refreshToken;

  User
    .findOne(
      {_id: userId, refreshToken: refreshToken},
      (err, user) => {
        if (err) {
          res.status(400).json({
            message: err.message
          });
        } else {
          if (user) {
            const systemUser = {
              "userId": user._id,
              "phone": user.phone
            };
            
            const token = jwt.sign(systemUser, config.secret, { expiresIn: config.tokenLife})
            user.accessToken = token;
            user.save(function (err, user) {
              if (err) {
                res.status(400).json({
                  message: err.message
                });
              } else {
                res.status(200).json({'new_access_token': user.accessToken});
              }}
            );
        } else {
          res.status(400).json({
            message: "User or Refresh Token not found"
          });
        }

        }})
})

module.exports = router;
