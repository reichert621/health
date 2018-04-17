exports.up = (knex) => {
  return knex.schema.table('users', table => {
    table.string('instagramAccessToken');
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', table => {
    table.dropColumn('instagramAccessToken');
  });
};
