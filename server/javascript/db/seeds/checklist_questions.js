exports.seed = (knex, Promise) => {
  const questions = [
    { id: 1, text: 'Feeling sad or down in the dumps', category: null },
    { id: 2, text: 'Feeling unhappy or blue', category: null },
    { id: 3, text: 'Crying spells or tearfulness', category: null },
    { id: 4, text: 'Feeling discouraged', category: null },
    { id: 5, text: 'Feeling hopeless', category: null },
    { id: 6, text: 'Low self-esteem', category: null },
    { id: 7, text: 'Feeling worthless or inadequate', category: null },
    { id: 8, text: 'Guilt or shame', category: null },
    { id: 9, text: 'Criticizing yourself or blaming yourself', category: null },
    { id: 10, text: 'Difficulty making decisions', category: null },
    { id: 11, text: 'Loss of interest in family, friends, or colleagues', category: null },
    { id: 12, text: 'Loneliness', category: null },
    { id: 13, text: 'Spending less time with family or friends', category: null },
    { id: 14, text: 'Loss of motivation', category: null },
    { id: 15, text: 'Loss of interest in work or other activities', category: null },
    { id: 16, text: 'Avoiding work or other activities', category: null },
    { id: 17, text: 'Loss of pleasure or satisfaction in life', category: null },
    { id: 18, text: 'Feeling tired', category: null },
    { id: 19, text: 'Difficulty sleeping or sleeping too much', category: null },
    { id: 20, text: 'Decreased or increased appetite', category: null },
    { id: 21, text: 'Loss of interest in sex', category: null },
    { id: 22, text: 'Worrying about your health', category: null },
    { id: 23, text: 'Do you have any suicidal thoughts?', category: null },
    { id: 24, text: 'Would you like to end your life?', category: null },
    { id: 25, text: 'Do you have a plan for harming yourself?', category: null }
  ];

  const insert = (questions) =>
    Promise.all(
      questions.map(question => knex('checklist_questions').insert(question))
    );

  return knex('checklist_questions').del()
    .then(() => insert(questions));
};
