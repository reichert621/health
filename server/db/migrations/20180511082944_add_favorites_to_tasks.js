exports.up = (knex) => {
  return knex.schema.table('tasks', table => {
    table.boolean('isFavorite').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table('tasks', table => {
    table.dropColumn('isFavorite');
  });
};
