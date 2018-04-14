exports.seed = (knex, Promise) => {
  const scores = [
    { id: 1, checklistId: 1, checklistQuestionId: 1, score: 3, userId: 1 },
    { id: 2, checklistId: 1, checklistQuestionId: 2, score: 1, userId: 1 },
    { id: 3, checklistId: 1, checklistQuestionId: 3, score: 2, userId: 1 }
  ];

  const insert = (scores) =>
    Promise.all(
      scores.map(score => knex('checklist_scores').insert(score))
    );

  // return knex('checklist_scores').del()
  //   .then(() => insert(scores));
};
