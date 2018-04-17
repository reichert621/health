const request = require('request');
const User = require('./db/models/user');

const API = 'https://api.instagram.com';
const {
  IG_CLIENT_ID,
  IG_CLIENT_SECRET,
  IG_REDIRECT_URI
} = process.env;

const fetch = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (err, res, body) => {
      if (err) return reject(err);

      return resolve({
        response: res,
        body: JSON.parse(body)
      });
    });
  });
};

const endpoints = {
  AUTHORIZE: `${API}/oauth/authorize/`,
  ACCESS_TOKEN: `${API}/oauth/access_token`,
  MEDIA: `${API}/v1/users/self/media/recent`
};


const AUTH_URL = endpoints.AUTHORIZE
  .concat(`?client_id=${IG_CLIENT_ID}`)
  .concat(`&redirect_uri=${IG_REDIRECT_URI}`)
  .concat('&response_type=code');

const config = {
  clientId: IG_CLIENT_ID,
  clientSecret: IG_CLIENT_SECRET,
  redirectUri: IG_REDIRECT_URI,
  authUrl: AUTH_URL
};

const fetchAuthUrl = (req, res) => res.json({ url: AUTH_URL });

const fetchToken = (req, res) => {
  const token = req.user.instagramAccessToken;

  return res.json({ token });
};

const auth = (req, res) => {
  const { code } = req.query;
  const { id: userId } = req.user;
  const options = {
    url: endpoints.ACCESS_TOKEN,
    method: 'POST',
    form: {
      code,
      client_id: IG_CLIENT_ID,
      client_secret: IG_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: IG_REDIRECT_URI
    }
  };

  return fetch(options)
    .then(({ body }) => {
      const { access_token: token } = body;

      return User.setInstagramToken(userId, token);
    })
    .then(result => {
      return res.redirect('/instagram');
    })
    .catch(err => {
      return res.json({ error: err });
    });
};

const media = (req, res) => {
  const token = req.user.instagramAccessToken;

  if (!token) {
    return res.json({ error: 'Instagram access token required!' });
  }

  const options = {
    url: endpoints.MEDIA,
    method: 'GET',
    qs: {
      access_token: token,
      count: 20
    }
  };

  return fetch(options)
    .then(({ body, response }) => {
      const { data, pagination } = body;

      return res.json({ result: data });
    })
    .catch(err => {
      return res.json({ error: err });
    });
};

module.exports = {
  config,
  fetchAuthUrl,
  fetchToken,
  auth,
  media
};
