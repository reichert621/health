const knex = require('../knex.js');

const Users = () => knex('users');

const fetch = () => Users().select();

module.exports = {
  fetch
};
