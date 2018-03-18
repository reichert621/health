exports.up = (knex) => {
  return knex.schema.createTable('gratitudes', (table) => {
    table.increments('id');
    table.bigInteger('userId').notNullable();
    table.string('text').notNullable();
    table.date('date').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('gratitudes');
};
