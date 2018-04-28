const { first, isObject, isEmpty } = require('lodash');
const knex = require('../knex');

const AccomplishedChallenges = () => knex('user_accomplished_challenges');

const fetch = (where = {}, userId) => {
  return AccomplishedChallenges()
    .select()
    .where({ ...where, userId });
};

const findOne = (where = {}, userId) => {
  return fetch(where, userId).first();
};

const findById = (id, userId, where = {}) => {
  return findOne({ ...where, id }, userId);
};

const fetchChallengeAccomplishments = (date, challengeIds = []) => {
  if (!date) return Promise.reject(new Error('Date is required!'));

  return AccomplishedChallenges()
    .select('uac.*', 'u.username', 'u.email')
    .from('user_accomplished_challenges as uac')
    .innerJoin('users as u', 'uac.userId', 'u.id')
    .whereIn('uac.challengeId', challengeIds)
    .andWhere({ 'uac.date': date });
};

const create = (params = {}, userId) => {
  return AccomplishedChallenges()
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

  return AccomplishedChallenges()
    .where({ ...where, userId })
    .del();
};


module.exports = {
  fetch,
  findById,
  fetchChallengeAccomplishments,
  create,
  findOrCreate,
  update,
  destroyById,
  destroyWhere
};
