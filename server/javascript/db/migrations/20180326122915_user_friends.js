exports.up = (knex) => {
  return knex.schema.createTable('user_friends', (table) => {
    table.increments('id');
    table.bigInteger('userId').notNullable();
    table.bigInteger('friendId').notNullable();
    table.string('status');
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('user_friends');
};
