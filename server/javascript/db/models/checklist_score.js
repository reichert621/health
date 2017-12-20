const knex = require('../knex.js');
const { first } = require('lodash');

const ChecklistScore = () => knex('checklist_scores');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) =>
  ChecklistScore()
    .select()
    .where(merge(where, { userId }));

const findOne = (where, userId) =>
  fetch(where, userId)
    .first();

const fetchByChecklistId = (checklistId, userId, where = {}) =>
  fetch(merge(where, { checklistId }), userId);

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { id }), userId);

const create = (params, userId) =>
  ChecklistScore()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const update = (id, params, userId) =>
  findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroy = (id, userId) =>
  findById(id, userId)
    .delete();

module.exports = {
  fetch,
  findById,
  fetchByChecklistId,
  create,
  update,
  destroy
};
