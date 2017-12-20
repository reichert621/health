exports.seed = (knex, Promise) => {
  const categories = [
    { id: 1, name: 'Read' },
    { id: 2, name: 'Write' },
    { id: 3, name: 'Exercise' },
    { id: 4, name: 'Eat Healthy' },
    { id: 5, name: 'Code' },
    { id: 6, name: 'Music' },
    { id: 7, name: 'Podcast' },
    { id: 8, name: 'Socialize' },
    { id: 9, name: 'Meditate' }
  ];

  const insert = (categories) =>
    Promise.all(
      categories.map(category => knex('categories').insert(category))
    );

  return knex('categories').del()
    .then(() => insert(categories));
};
