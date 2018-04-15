exports.up = function(knex, Promise) {
  return knex.schema.createTable('checklist_questions', (table) => {
    table.increments('id');
    table.string('text').notNullable();
    table.string('category');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('checklist_questions');
};
