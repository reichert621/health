const passport = require('passport');
const { Strategy } = require('passport-local');
const { User } = require('./db');

const { findByUsername, verifyUser, findById } = User;

const DEFAULT_REDIRECT = '/';

const verify = (username, password, cb) =>
  findByUsername(username)
    .then(user => {
      if (!user) return cb(null, false);
      if (!verifyUser(user, password)) {
        return cb(null, false);
      }

      return cb(null, user);
    })
    .catch(err => cb(err));

const strategy = new Strategy(verify);

const serialize = (user, done) =>
  done(null, user.id);

const deserialize = (id, done) =>
  findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));

const authenticate = (type = 'local') =>
  passport.authenticate(type, {
    failureRedirect: DEFAULT_REDIRECT
  });

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send();
};

module.exports = {
  strategy,
  serialize,
  deserialize,
  isAuthenticated,
  auth: authenticate()
};
