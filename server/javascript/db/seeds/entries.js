exports.seed = (knex, Promise) => {
  const entries = [
    { id: 1, hash: 'a1b', userId: 1, title: 'Dec 1', content: 'Sample Entry #1', isPrivate: false },
    { id: 2, hash: 'b2c', userId: 1, title: 'Dec 2', content: 'Sample Entry #2', isPrivate: false },
    { id: 3, hash: 'c3d', userId: 1, title: 'Dec 3', content: 'Sample Entry #3', isPrivate: true }
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
        .map(entry => knex('entries').insert(entry))
    );

  // return knex('entries').del()
  //   .then(() => insert(entries));
};
