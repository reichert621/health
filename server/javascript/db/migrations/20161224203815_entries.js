exports.up = (knex, Promise) => {
  return knex.schema.createTable('entries', (table) => {
    table.increments('id');
    table.timestamps();
    table.string('title').notNullable();
    table.text('content').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('entries');
};
