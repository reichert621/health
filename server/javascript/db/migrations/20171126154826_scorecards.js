exports.up = function(knex, Promise) {
  return knex.schema.createTable('scorecards', (table) => {
    table.increments('id');
    table.bigInteger('userId');
    table.string('title');
    table.date('date').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('scorecards');
};
