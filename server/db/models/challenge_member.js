const { first, isObject, isEmpty } = require('lodash');
const knex = require('../knex');

const ChallengeMember = () => knex('challenge_members');

const fetch = (where = {}, userId) => {
  return ChallengeMember()
    .select()
    .where({ ...where, userId });
};

const fetchByUserId = (userId, where = {}) => {
  return fetch(where, userId);
};

const findOne = (where = {}, userId) => {
  return fetch(where, userId).first();
};

const findById = (id, userId, where = {}) => {
  return findOne({ ...where, id }, userId);
};

const create = (params = {}, userId) => {
  return ChallengeMember()
    .returning('id')
    .insert({ ...params, userId })
    .then(first)
    .then(id => findById(id, userId));
};

const findOrCreate = (params, userId) => {
  return findOne(params, userId)
    .then(found => {
      if (found) {
        return found;
      }

      return create(params, userId);
    });
};

const update = (id, updates = {}, userId) => {
  return findById(id, userId)
    .update(updates)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const destroyById = (id, userId) => {
  return findById(id, userId).delete();
};

const destroyWhere = (where = {}, userId) => {
  if (!userId) return Promise.reject(new Error('A userId is required!'));
  if (!isObject(where) || isEmpty(where)) {
    return Promise.reject(new Error('A valid where filter is required!'));
  }

  return ChallengeMember()
    .where({ ...where, userId })
    .del();
};


module.exports = {
  fetch,
  fetchByUserId,
  findById,
  create,
  findOrCreate,
  update,
  destroyById,
  destroyWhere
};
