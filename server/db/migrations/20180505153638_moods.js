exports.up = (knex) => {
  const moods = [
    { id: 1, description: 'Very Unhappy', code: 'very_unhappy' },
    { id: 2, description: 'Unhappy', code: 'unhappy' },
    { id: 3, description: 'Neutral', code: 'neutral' },
    { id: 4, description: 'Happy', code: 'happy' },
    { id: 5, description: 'Very Happy', code: 'very_happy' }
  ];

  return Promise.all([
    knex.schema.createTable('moods', (table) => {
      table.increments('id');
      table.string('description').notNullable();
      table.string('code').notNullable();
    }),
    knex.schema.createTable('user_moods', (table) => {
      table.increments('id');
      table.bigInteger('userId').notNullable();
      table.bigInteger('moodId').notNullable();
      table.date('date').defaultTo(knex.fn.now());
    })
  ])
    .then(() => {
      const promises = moods.map(mood => knex('moods').insert(mood));

      return Promise.all(promises);
    });
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('moods'),
    knex.schema.dropTable('user_moods')
  ]);
};
