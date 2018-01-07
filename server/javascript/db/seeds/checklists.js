exports.seed = (knex, Promise) => {
  const checklists = [
    { id: 1, date: new Date('2017-11-02'), userId: 1 },
    { id: 2, date: new Date('2017-11-03'), userId: 1 },
    { id: 3, date: new Date('2017-11-04'), userId: 1 }
  ];

  const insert = (checklists) =>
    Promise.all(
      checklists.map(list => knex('checklists').insert(list))
    );

  // return knex('checklists').del()
  //   .then(() => insert(checklists));
};
