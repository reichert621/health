exports.seed = (knex, Promise) => {
  const scorecards = [
    { id: 1, userId: 1, date: new Date('2017-09-01') },
    { id: 2, userId: 1, date: new Date('2017-09-02') },
    { id: 3, userId: 1, date: new Date('2017-09-03') }
  ];

  const insert = (scorecards) =>
    Promise.all(
      scorecards.map(scorecard => knex('scorecards').insert(scorecard))
    );

  // return knex('scorecards').del()
  //   .then(() => insert(scorecards));
};
