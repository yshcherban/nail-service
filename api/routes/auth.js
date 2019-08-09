const express = require('express');
const router = express.Router();
const { login } = require('../controllers');
const { setUserInstagramAccessToken } = require('../controllers');

const Instagram = require('node-instagram').default;

const instagram = new Instagram({
  clientId: '2286b1bb3e7d4715a9fb028ae2bd3ea2',
  clientSecret: '7da219767f6c4e548974d8dd2a2049fc',
});
//http://95.214.63.131:32770
//http://127.0.0.1:3000
const redirectUri = 'http://127.0.0.1:3000/api/auth/instagram/callback';

router.get('/instagram', (req, res, next) => {
  const userId = req.query.userId;
  res.redirect(instagram.getAuthorizationUrl(
    redirectUri, {
      scope: ['basic'],
      state: userId
    },
  ));
});

router.get('/instagram/callback', async (req, res, next) => {
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

router.post('/token', (req, res, next) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
})

module.exports = router;
