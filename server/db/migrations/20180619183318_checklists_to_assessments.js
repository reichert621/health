const User = require('../models/user');
const Checklist = require('../models/checklist');

exports.up = (knex) => {
  return User.fetch()
    .then(users => {
      const userIds = users.map(u => u.id);
      const promises = userIds.map(userId => Checklist.migrateByUser(userId));

      return Promise.all(promises);
    });
};

exports.down = (knex, Promise) => {
  return Promise.resolve();
};
