exports.up = function(knex, Promise) {
  return knex.schema.createTable('checklists', (table) => {
    table.increments('id');
    table.date('date').notNullable();
    table.bigInteger('userId').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('checklists');
};
