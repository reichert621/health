exports.up = (knex) => {
  const assessments = [
    {
      id: 1, type: 'depression', title: 'Depression Assessment', description: 'Measures depression on a scale of 0 to 100'
    },
    {
      id: 2, type: 'anxiety', title: 'Anxiety Assessment', description: 'Measures anxiety on a scale of 0 to 100'
    },
    {
      id: 3, type: 'wellbeing', title: 'Well-Being Assessment', description: 'Measures well-being on a scale of 0 to 80 based on the PERMA model'
    }
  ];

  const questions = {
    depression: [
      { assessmentId: 1, text: 'Feeling sad or down in the dumps', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Feeling unhappy or blue', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Crying spells or tearfulness', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Feeling discouraged', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Feeling hopeless', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Low self-esteem', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Feeling worthless or inadequate', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Guilt or shame', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Criticizing yourself or blaming yourself', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Difficulty making decisions', category: 'Thoughts and Feelings' },
      { assessmentId: 1, text: 'Loss of interest in family, friends, or colleagues', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Loneliness', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Spending less time with family or friends', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Loss of motivation', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Loss of interest in work or other activities', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Avoiding work or other activities', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Loss of pleasure or satisfaction in life', category: 'Activities and Personal Relationships' },
      { assessmentId: 1, text: 'Feeling tired', category: 'Physical Symptoms' },
      { assessmentId: 1, text: 'Difficulty sleeping or sleeping too much', category: 'Physical Symptoms' },
      { assessmentId: 1, text: 'Decreased or increased appetite', category: 'Physical Symptoms' },
      { assessmentId: 1, text: 'Loss of interest in sex', category: 'Physical Symptoms' },
      { assessmentId: 1, text: 'Worrying about your health', category: 'Physical Symptoms' },
      { assessmentId: 1, text: 'Do you have any suicidal thoughts?', category: 'Suicidal Urges' },
      { assessmentId: 1, text: 'Would you like to end your life?', category: 'Suicidal Urges' },
      { assessmentId: 1, text: 'Do you have a plan for harming yourself?', category: 'Suicidal Urges' }
    ],
    anxiety: [
      { assessmentId: 2, text: 'I have digestive problems.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have a dry mouth.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I experience shortness of breath or choking feelings.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have sweaty or cold, clammy hands.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I feel like fainting.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have a "lump in throat" feeling.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I experience twitching, trembling or shaky feelings.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have hot and/or cold flashes.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I feel dizzy or light-headed.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I feel tired.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have palpitations, pounding heart, or accelerated heart rate.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have to go to the restroom frequently.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I get numbness and/or a tingling feeling.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I have headaches or neck pain.', category: 'Physical Symptoms' },
      { assessmentId: 2, text: 'I tend to focus on upsetting situations or events happening in my life.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I spend the day thinking about things I could have done better.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'No matter what I do, I can\'t get my mind off my problems.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I spend time wondering why I feel the way I do.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I think a lot about why I do the things I do.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I think about all the things I have not yet accomplished.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I am afraid of what awaits me in the future.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I can think about a problem for hours and still not feel that the issue is resolved.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I think about how unsatisfied I am with my life.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I worry a lot.', category: 'Cognitive Distortions' },
      { assessmentId: 2, text: 'I worry about my health or dying.', category: 'Cognitive Distortions' }
    ],
    wellbeing: [
      { assessmentId: 3, text: 'I lead a purposeful and meaningful life', category: 'Meaning' },
      { assessmentId: 3, text: 'I feel I am making progress towards accomplishing my goals', category: 'Accomplishment' },
      { assessmentId: 3, text: 'I am usually absorbed in what I am doing', category: 'Engagement' },
      { assessmentId: 3, text: 'I am in good health', category: 'Accomplishment' },
      { assessmentId: 3, text: 'I feel joyful', category: 'Positive Emotion' },
      { assessmentId: 3, text: 'I receive help and support from others when I need it', category: 'Relationships' },
      { assessmentId: 3, text: 'I feel calm', category: 'Positive Emotion' },
      { assessmentId: 3, text: 'I often achieve important goals for myself', category: 'Accomplishment' },
      { assessmentId: 3, text: 'What I do is valuable and worthwhile', category: 'Meaning' },
      { assessmentId: 3, text: 'I feel positive', category: 'Positive Emotion' },
      { assessmentId: 3, text: 'I feel excited and interested in my work', category: 'Engagement' },
      { assessmentId: 3, text: 'I feel close to other people', category: 'Relationships' },
      { assessmentId: 3, text: 'I am satisfied with my current physical health', category: 'Accomplishment' },
      { assessmentId: 3, text: 'I feel loved', category: 'Relationships' },
      { assessmentId: 3, text: 'I am able to handle my responsibilities', category: 'Accomplishment' },
      { assessmentId: 3, text: 'I have a sense of direction in my life', category: 'Meaning' },
      { assessmentId: 3, text: 'I am satisfied with my personal relationships', category: 'Relationships' },
      { assessmentId: 3, text: 'I often lose track of time while doing something I enjoy', category: 'Engagement' },
      { assessmentId: 3, text: 'I feel contented', category: 'Positive Emotion' },
      { assessmentId: 3, text: 'I feel happy', category: 'Positive Emotion' }
    ]
  };

  return Promise.all([
    knex.schema.createTable('assessments', (table) => {
      table.increments('id');
      table.string('type').notNullable();
      table.string('title').notNullable();
      table.string('description');
    }),
    knex.schema.createTable('user_assessments', (table) => {
      table.increments('id');
      table.bigInteger('userId').notNullable();
      table.bigInteger('assessmentId').notNullable();
      table.date('date').notNullable();
    }),
    knex.schema.createTable('assessment_questions', (table) => {
      table.increments('id');
      table.string('text').notNullable();
      table.string('category').notNullable();
      table.bigInteger('assessmentId').notNullable();
    }),
    knex.schema.createTable('user_assessment_scores', (table) => {
      table.increments('id');
      table.bigInteger('userId').notNullable();
      table.bigInteger('userAssessmentId').notNullable();
      table.bigInteger('assessmentQuestionId').notNullable();
      table.integer('score').notNullable();
    })
  ])
    .then(() => {
      const promises = assessments.map(assessment =>
        knex('assessments').insert(assessment));

      return Promise.all(promises);
    })
    .then(() => {
      const promises = Object.keys(questions)
        .reduce((flattened, type) => {
          const qs = questions[type];

          return flattened.concat(qs);
        }, [])
        .map(question => knex('assessment_questions').insert(question));

      return Promise.all(promises);
    });
};

exports.down = (knex) => {
  return Promise.all([
    knex.schema.dropTable('assessments'),
    knex.schema.dropTable('user_assessments'),
    knex.schema.dropTable('assessment_questions'),
    knex.schema.dropTable('user_assessment_scores')
  ]);
};
