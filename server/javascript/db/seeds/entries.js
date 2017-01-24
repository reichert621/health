exports.seed = (knex, Promise) => {
  const entries = [
    { title: 'Dec 1', content: 'Sample Entry #1' },
    { title: 'Dec 2', content: 'Sample Entry #2' },
    { title: 'Dec 3', content: 'Sample Entry #3' }
  ];

  const addTimestamps = (entry) =>
    Object.assign(entry, {
      created_at: new Date(),
      updated_at: new Date()
    });

  const insert = (entries) =>
    Promise.all(
      entries
        .map(addTimestamps)
        .map(entry =>
          knex('entries').insert(entry))
    );

  return knex('entries').del()
    .then(() => insert(entries));
};
