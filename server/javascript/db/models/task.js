const knex = require('../knex.js');
const { first } = require('lodash');

const Tasks = () => knex('tasks');

const merge = (x, y) => Object.assign({}, x, y);

// TODO: clean this up or rename
const fetch = (where = {}, userId) =>
  Tasks()
    .select('tasks.*', 'categories.name as category')
    .innerJoin('categories', 'tasks.categoryId', 'categories.id')
    .where(merge(where, { 'tasks.userId': userId }))
    .orderBy('tasks.id', 'asc');

const findOne = (where = {}, userId) =>
  fetch(where, userId).first();

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { 'tasks.id': id }), userId);

const create = (params = {}, userId) =>
  Tasks()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const update = (id, userId, params = {}) =>
  findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroy = (id, userId) =>
  findById(id, userId).delete();

module.exports = {
  fetch,
  findById,
  create,
  update,
  destroy
};
