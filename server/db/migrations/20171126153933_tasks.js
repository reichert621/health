exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id');
    table.bigInteger('userId');
    table.bigInteger('categoryId').notNullable();
    table.string('description').notNullable();
    table.integer('points').notNullable();
    table.boolean('isActive').defaultTo(true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks');
};
