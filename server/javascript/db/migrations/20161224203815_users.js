exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users');
};
