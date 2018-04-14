exports.up = function(knex, Promise) {
  return knex.schema.createTable('checklist_scores', (table) => {
    table.increments('id');
    table.bigInteger('userId').notNullable();
    table.bigInteger('checklistId').notNullable();
    table.bigInteger('checklistQuestionId').notNullable();
    table.integer('score').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('checklist_scores');
};
