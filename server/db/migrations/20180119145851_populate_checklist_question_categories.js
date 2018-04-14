const questions = [
  {
    id: 1,
    text: 'Feeling sad or down in the dumps',
    category: 'Thoughts and Feelings'
  },
  {
    id: 2,
    text: 'Feeling unhappy or blue',
    category: 'Thoughts and Feelings'
  },
  {
    id: 3,
    text: 'Crying spells or tearfulness',
    category: 'Thoughts and Feelings'
  },
  { id: 4, text: 'Feeling discouraged', category: 'Thoughts and Feelings' },
  { id: 5, text: 'Feeling hopeless', category: 'Thoughts and Feelings' },
  { id: 6, text: 'Low self-esteem', category: 'Thoughts and Feelings' },
  {
    id: 7,
    text: 'Feeling worthless or inadequate',
    category: 'Thoughts and Feelings'
  },
  { id: 8, text: 'Guilt or shame', category: 'Thoughts and Feelings' },
  {
    id: 9,
    text: 'Criticizing yourself or blaming yourself',
    category: 'Thoughts and Feelings'
  },
  {
    id: 10,
    text: 'Difficulty making decisions',
    category: 'Thoughts and Feelings'
  },
  {
    id: 11,
    text: 'Loss of interest in family, friends, or colleagues',
    category: 'Activities and Personal Relationships'
  },
  {
    id: 12,
    text: 'Loneliness',
    category: 'Activities and Personal Relationships'
  },
  {
    id: 13,
    text: 'Spending less time with family or friends',
    category: 'Activities and Personal Relationships'
  },
  {
    id: 14,
    text: 'Loss of motivation',
    category: 'Activities and Personal Relationships'
  },
  {
    id: 15,
    text: 'Loss of interest in work or other activities',
    category: 'Activities and Personal Relationships'
  },
  {
    id: 16,
    text: 'Avoiding work or other activities',
    category: 'Activities and Personal Relationships'
  },
  {
    id: 17,
    text: 'Loss of pleasure or satisfaction in life',
    category: 'Activities and Personal Relationships'
  },
  { id: 18, text: 'Feeling tired', category: 'Physical Symptoms' },
  {
    id: 19,
    text: 'Difficulty sleeping or sleeping too much',
    category: 'Physical Symptoms'
  },
  {
    id: 20,
    text: 'Decreased or increased appetite',
    category: 'Physical Symptoms'
  },
  { id: 21, text: 'Loss of interest in sex', category: 'Physical Symptoms' },
  {
    id: 22,
    text: 'Worrying about your health',
    category: 'Physical Symptoms'
  },
  {
    id: 23,
    text: 'Do you have any suicidal thoughts?',
    category: 'Suicidal Urges'
  },
  {
    id: 24,
    text: 'Would you like to end your life?',
    category: 'Suicidal Urges'
  },
  {
    id: 25,
    text: 'Do you have a plan for harming yourself?',
    category: 'Suicidal Urges'
  }
];

exports.up = function(knex, Promise) {
  return knex('checklist_questions')
    .del()
    .then(() => {
      return Promise.all(
        questions.map(question => knex('checklist_questions').insert(question))
      );
    });
};

exports.down = function(knex, Promise) {
  return knex('checklist_questions')
    .del()
    .then(() => {
      return Promise.all(
        questions.map(question => {
          const q = Object.assign(question, { category: null });

          return knex('checklist_questions').insert(q);
        })
      );
    });
};
