const knex = require('../knex.js');
const crypto = require('crypto');
const { first } = require('lodash');

const reject = (msg) => Promise.reject(new Error(msg));

// TODO: move to models
const Users = () => knex('users');

const makeSalt = (num = 20) =>
  crypto
    .randomBytes(num)
    .toString('hex');

const getHashed = (password, salt) =>
  crypto
    .createHmac('sha512', salt)
    .update(password)
    .digest('hex');

const verifyPassword = (password, salt, hashed) =>
  getHashed(password, salt) === hashed;

const isValidUser = (user, password) => {
  if (!user) throw new Error(`Invalid user ${user}!`);

  const { salt, password: hashed } = user;
  const isValid = verifyPassword(password, salt, hashed);

  return isValid;
};

const verifyUser = (user, password) => {
  if (isValidUser(user, password)) {
    return user;
  } else {
    throw new Error('Invalid password!');
  }
};

const sanitized = (params) => {
  const { password } = params;
  const salt = makeSalt();

  return Object.assign({}, params, {
    salt,
    password: getHashed(password, salt)
  });
};

const fetch = (where = {}) =>
  Users()
    .select()
    .where(where);

const findOne = (where) =>
  fetch(where)
    .first();

const findById = (id) =>
  findOne({ id });

const findByUsername = (username) =>
  findOne({ username });

const findByEmail = (email) =>
  findOne({ email });

const create = (params) =>
  Users()
    .returning('id')
    .insert(sanitized(params))
    .then(first)
    .then(findById);

const register = (params) => {
  const { username, email, password } = params;

  if (!username) return reject('Username is required!');
  if (!email) return reject('Email is required!');
  if (!password) return reject('Password is required!');

  return Promise.all([
    findByUsername(username),
    findByEmail(email)
  ])
    .then(([existingUsername, existingEmail]) => {
      if (existingUsername) throw new Error('That username is taken!');
      if (existingEmail) throw new Error('That email address is taken!');

      return create(params);
    });
};

const authenticate = ({ username, password }) =>
  findByUsername(username)
    .then(user =>
      verifyUser(user, password));

module.exports = {
  fetch,
  findOne,
  findById,
  findByUsername,
  findByEmail,
  create,
  register,
  authenticate,
  verifyUser
};
