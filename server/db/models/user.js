const knex = require('../knex.js');
const crypto = require('crypto');
const { first, groupBy } = require('lodash');
const Category = require('./category');
const Task = require('./task');
const DefaultTasks = require('./default_tasks');

const reject = (msg) => Promise.reject(new Error(msg));

const Users = () => knex('users');
const UserFriends = () => knex('user_friends');

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

const fetchFriends = (userId) => {
  return UserFriends()
    .select('f.id', 'f.email', 'f.username')
    .from('user_friends as uf')
    .innerJoin('users as f', 'uf.friendId', 'f.id')
    .where({ 'uf.userId': userId });
};

const createCategoryTasks = (category, tasks, userId) => {
  return Category.findOrCreate(category, userId)
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
  // Just start with 4 of the default tasks, let user create the rest
  const defaults = DefaultTasks.getDefaults().slice(0, 4);
  const grouped = groupBy(defaults, 'category');
  const promises = Object.keys(grouped)
    .map(categoryName => {
      const category = { name: categoryName, isActive: true };
      const tasks = grouped[categoryName];

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
  fetchFriends,
  create,
  register,
  authenticate,
  verifyUser
};
