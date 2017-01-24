const knex = require('../knex.js');
const crypto = require('crypto');
const { first } = require('lodash');

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

const verifyUser = (user, password) => {
  if (!user) {
    throw new Error('Invalid user!');
  }

  const { salt, password: hashed } = user;
  const isValid = verifyPassword(password, salt, hashed);

  if (isValid) {
    return user;
  } else {
    throw new Error('Invalid password!');
  }
}

const sanitized = (params) => {
  const { password } = params;
  const salt = makeSalt();

  return Object.assign({}, params, {
    salt,
    password: getHashed(password, salt)
  });
};

const fetch = () => Users().select();

const create = (params) =>
  Users()
    .returning('id')
    .insert(sanitized(params))
    .then(first)
    .then(findById);

const authenticate = ({ username, password }) =>
  fetch()
    .where({ username })
    .first()
    .then(user =>
      verifyUser(user, password));

module.exports = {
  fetch,
  create,
  authenticate
};
