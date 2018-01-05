const knex = require('../knex.js');
const { first } = require('lodash');

const Categories = () => knex('categories');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) =>
  Categories()
    .select()
    .where(merge(where, { userId }));

const findOne = (where = {}, userId) =>
  fetch(where, userId).first();

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { id }), userId);

const create = (params = {}, userId) =>
  Categories()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const update = (id, userId, params = {}) =>
  findById(id)
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
