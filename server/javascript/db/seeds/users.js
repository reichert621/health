const { create } = require('../controllers/users');

exports.seed = (knex, Promise) => {
  const users = [
    { email: 'alex@alex.com', username: 'alex', password: 'password' },
    { email: 'test@test.com', username: 'test', password: 'asdfasdf' }
  ];

  const insert = (users) =>
    Promise.all(
      users.map(create)
    );

  return knex('users').del()
    .then(() => insert(users));
};
