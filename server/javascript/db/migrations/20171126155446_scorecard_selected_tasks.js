exports.up = function(knex, Promise) {
  return knex.schema.createTable('scorecard_selected_tasks', (table) => {
    table.increments('id');
    table.bigInteger('scorecardId').notNullable();
    table.bigInteger('taskId').notNullable();
    table.bigInteger('userId').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('scorecard_selected_tasks');
};
