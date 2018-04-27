exports.up = (knex) => {
  return Promise.all([
    knex.schema.createTable('challenges', (table) => {
      table.increments('id');
      table.string('description').notNullable();
      table.text('text'); // optional additional info
      table.bigInteger('creatorId').notNullable();
      table.boolean('isActive').defaultTo(false);
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.string('frequency'); // e.g. "3 per week" (see `unit` below)
      table.string('unit');
    }),
    knex.schema.createTable('challenge_members', (table) => {
      table.increments('id');
      table.bigInteger('userId').notNullable();
      table.bigInteger('challengeId').notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('user_accomplished_challenges', (table) => {
      table.increments('id');
      table.date('date').notNullable();
      table.bigInteger('userId').notNullable();
      table.bigInteger('challengeId').notNullable();
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('challenges'),
    knex.schema.dropTable('challenge_members'),
    knex.schema.dropTable('user_accomplished_challenges')
  ]);
};
