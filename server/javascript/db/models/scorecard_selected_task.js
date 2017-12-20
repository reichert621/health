const knex = require('../knex.js');
const { first, groupBy, isNumber } = require('lodash');

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

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroy = (id, userId) =>
  findById(id, userId)
    .delete();

module.exports = {
  fetch,
  fetchByScorecardId,
  findById,
  create,
  update,
  destroy
};
