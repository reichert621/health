const knex = require('../knex.js');
const crypto = require('crypto');
const { first, extend } = require('lodash');
const Category = require('./category');
const Task = require('./task');
const DefaultTasks = require('./default_tasks');

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

const createCategoryTasks = (category, tasks, userId) => {
  return Category.create(category, userId)
    .then(({ id: categoryId }) => {
      const promises = tasks.map(task => {
        const { description, points } = task;
        const params = {
          description,
          points,
          categoryId,
          isActive: true
        };

        return Task.create(params, userId);
      });

      return Promise.all(promises);
    });
};

const createDefaultTasks = (user) => {
  const { id: userId } = user;
  const defaults = DefaultTasks.getDefaults();
  const promises = Object.keys(defaults)
    .map(categoryName => {
      const category = { name: categoryName, isActive: true };
      const tasks = defaults[categoryName];

      return createCategoryTasks(category, tasks, userId);
    });

  return Promise.all(promises);
};

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
    })
    .then(user => createDefaultTasks(user));
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
