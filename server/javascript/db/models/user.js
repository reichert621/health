const knex = require('../knex.js');
const crypto = require('crypto');
const { first } = require('lodash');

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

const create = (params) =>
  Users()
    .returning('id')
    .insert(sanitized(params))
    .then(first)
    .then(findById);

const authenticate = ({ username, password }) =>
  findByUsername(username)
    .then(user =>
      verifyUser(user, password));

module.exports = {
  fetch,
  findOne,
  findById,
  findByUsername,
  create,
  authenticate,
  verifyUser
};
