exports.up = (knex) => {
  return knex.schema.table('entries', table => {
    table.date('date');
  });
};

exports.down = (knex) => {
  return knex.schema.table('entries', table => {
    table.dropColumn('date');
  });
};
