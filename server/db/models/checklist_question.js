const knex = require('../knex.js');
const { first } = require('lodash');

const ChecklistQuestion = () => knex('checklist_questions');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}) =>
  ChecklistQuestion()
    .select()
    .where(where);

const findOne = (where = {}) =>
  fetch(where)
    .first();

const findById = (id, where = {}) =>
  findOne(merge(where, { id }));

const create = (params) =>
  ChecklistQuestion()
    .returning('id')
    .insert(params)
    .then(first)
    .then(id => findById(id));

const update = (id, params) =>
  findById(id)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id));

const destroy = (id) =>
  findById(id)
    .delete();

module.exports = {
  fetch,
  findById,
  create,
  update,
  destroy
};
