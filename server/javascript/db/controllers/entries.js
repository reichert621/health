const knex = require('../knex.js');
const { first } = require('lodash');

function Entries() {
  return knex('entries');
}

function fetch() {
  return Entries()
    .select();
}

function findById(id) {
  return fetch()
    .where({ id })
    .first();
}

function create(params) {
  return Entries()
    .returning('id')
    .insert(params)
    .then(first)
    .then(findById);
}

function destroy(id) {
  return findById(id)
    .delete();
}

module.exports = {
  fetch,
  findById,
  create,
  destroy
};
