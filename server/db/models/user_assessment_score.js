const { first } = require('lodash');
const knex = require('../knex');

const UserAssessmentScore = () => knex('user_assessment_scores');

const fetch = (where = {}, userId) => {
  return UserAssessmentScore()
    .select()
    .where({ ...where, userId });
};

const findOne = (where = {}, userId) => {
  return fetch(where, userId).first();
};

const findById = (id, userId, where = {}) => {
  return findOne({ ...where, id }, userId);
};

const create = (params, userId) => {
  return UserAssessmentScore()
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

const update = (id, updates, userId) => {
  return findById(id, userId)
    .update(updates)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const createOrUpdate = (where, updates = {}, userId) => {
  return findOne(where, userId)
    .then(result => {
      const id = result && result.id;
      const params = { ...where, ...updates };

      if (id) {
        return update(id, updates, userId);
      } else {
        return create(params, userId);
      }
    });
};

const destroy = (id, userId) => {
  return findById(id, userId).delete();
};

module.exports = {
  fetch,
  findById,
  create,
  findOrCreate,
  update,
  createOrUpdate,
  destroy
};
