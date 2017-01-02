const knex = require('../knex.js');
const { first } = require('lodash');

const Entries = () => knex('entries');

const fetch = () => Entries().select();

const findById = (id) =>
  fetch()
    .where({ id })
    .first();

const create = (params) =>
  Entries()
    .returning('id')
    .insert(params)
    .then(first)
    .then(findById);

const destroy = (id) =>
  findById(id)
    .delete();

module.exports = {
  fetch,
  findById,
  create,
  destroy
};
