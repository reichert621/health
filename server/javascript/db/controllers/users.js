const knex = require('../knex.js');

function Users() {
  return knex('users');
}

function fetch() {
  return Users().select();
}

module.exports = {
  fetch
};
