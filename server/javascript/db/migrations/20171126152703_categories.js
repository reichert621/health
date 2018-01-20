exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', (table) => {
    table.increments('id');
    table.bigInteger('userId');
    table.boolean('isActive').defaultTo(true);
    table.string('name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories');
};
