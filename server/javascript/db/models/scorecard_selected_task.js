const knex = require('../knex.js');
const { first, isObject, isEmpty } = require('lodash');

const ScoreCardSelectedTask = () => knex('scorecard_selected_tasks');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) =>
  ScoreCardSelectedTask()
    .select()
    .where(merge(where, { userId }));

const fetchByScorecardId = (scorecardId, userId, where = {}) =>
  fetch(merge(where, { scorecardId }), userId);

const findOne = (where, userId) =>
  fetch(where, userId)
    .first();

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { id }), userId);

const create = (params, userId) =>
  ScoreCardSelectedTask()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const findOrCreate = (params, userId) => {
  return findOne(params, userId)
    .then(selectedTask => {
      if (selectedTask) {
        return selectedTask;
      }

      return create(params, userId);
    });
};

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroyById = (id, userId) =>
  findById(id, userId)
    .delete();

const destroyWhere = (where = {}, userId) => {
  if (!userId) return Promise.reject(new Error('A userId is required!'));
  if (!isObject(where) || isEmpty(where)) {
    return Promise.reject(new Error('A valid where filter is required!'));
  }

  return ScoreCardSelectedTask()
    .where(where)
    .del();
};

const destroyByScorecardId = (scorecardId, userId) =>
  destroyWhere({ scorecardId }, userId);

module.exports = {
  fetch,
  fetchByScorecardId,
  findById,
  create,
  findOrCreate,
  update,
  destroyById,
  destroyWhere,
  destroyByScorecardId
};
