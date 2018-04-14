exports.up = (knex) => {
  return knex.schema.createTable('imperatives', (table) => {
    table.increments('id');
    table.bigInteger('userId').notNullable();
    table.string('type').notNullable();
    table.string('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('imperatives');
};
