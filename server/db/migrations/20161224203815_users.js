exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email').notNullable();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('salt').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
