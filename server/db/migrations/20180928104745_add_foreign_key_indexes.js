exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('assessment_questions', table => {
      table.foreign('assessmentId').references('assessments.id');
      table.index('assessmentId');
    }),
    knex.schema.table('categories', table => {
      table.foreign('userId').references('users.id');
      table.foreign('abilityId').references('abilities.id');
      table.index('userId');
      table.index('abilityId');
    }),
    knex.schema.table('checklist_scores', table => {
      table.foreign('userId').references('users.id');
      // table.foreign('checklistId').references('checklists.id');
      table.foreign('checklistQuestionId').references('checklist_questions.id');
      table.index('userId');
      table.index('checklistQuestionId');
      table.index('checklistId');
    }),
    knex.schema.table('checklists', table => {
      table.foreign('userId').references('users.id');
      table.index('userId');
    }),
    knex.schema.table('entries', table => {
      table.foreign('userId').references('users.id');
      table.index('userId');
    }),
    knex.schema.table('gratitudes', table => {
      table.foreign('userId').references('users.id');
      table.index('userId');
    }),
    knex.schema.table('imperatives', table => {
      table.foreign('userId').references('users.id');
      table.index('userId');
    }),
    knex.schema.table('scorecard_selected_tasks', table => {
      table.foreign('userId').references('users.id');
      table.foreign('taskId').references('tasks.id');
      // table.foreign('scorecardId').references('scorecards.id');
      table.index('userId');
      table.index('taskId');
      table.index('scorecardId');
    }),
    knex.schema.table('scorecards', table => {
      table.foreign('userId').references('users.id');
      table.index('userId');
    }),
    knex.schema.table('tasks', table => {
      table.foreign('userId').references('users.id');
      table.foreign('categoryId').references('categories.id');
      table.index('userId');
      table.index('categoryId');
    }),
    knex.schema.table('user_assessment_scores', table => {
      table.foreign('userId').references('users.id');
      table.foreign('userAssessmentId').references('user_assessments.id');
      table
        .foreign('assessmentQuestionId')
        .references('assessment_questions.id');
      table.index('userId');
      table.index('userAssessmentId');
      table.index('assessmentQuestionId');
    }),
    knex.schema.table('user_assessments', table => {
      table.foreign('userId').references('users.id');
      table.foreign('assessmentId').references('assessments.id');
      table.index('userId');
      table.index('assessmentId');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('assessment_questions', table => {
      table.dropForeign('assessmentId');
      table.dropIndex('assessmentId');
    }),
    knex.schema.table('categories', table => {
      table.dropForeign('userId');
      table.dropForeign('abilityId');
      table.dropIndex('userId');
      table.dropIndex('abilityId');
    }),
    knex.schema.table('checklist_scores', table => {
      table.dropForeign('userId');
      // table.dropForeign('checklistId');
      table.dropForeign('checklistQuestionId');
      table.dropIndex('userId');
      table.dropIndex('checklistQuestionId');
      table.dropIndex('checklistId');
    }),
    knex.schema.table('checklists', table => {
      table.dropForeign('userId');
      table.dropIndex('userId');
    }),
    knex.schema.table('entries', table => {
      table.dropForeign('userId');
      table.dropIndex('userId');
    }),
    knex.schema.table('gratitudes', table => {
      table.dropForeign('userId');
      table.dropIndex('userId');
    }),
    knex.schema.table('imperatives', table => {
      table.dropForeign('userId');
      table.dropIndex('userId');
    }),
    knex.schema.table('scorecard_selected_tasks', table => {
      table.dropForeign('userId');
      table.dropForeign('taskId');
      // table.dropForeign('scorecardId');
      table.dropIndex('userId');
      table.dropIndex('taskId');
      table.dropIndex('scorecardId');
    }),
    knex.schema.table('scorecards', table => {
      table.dropForeign('userId');
      table.dropIndex('userId');
    }),
    knex.schema.table('tasks', table => {
      table.dropForeign('userId');
      table.dropForeign('categoryId');
      table.dropIndex('userId');
      table.dropIndex('categoryId');
    }),
    knex.schema.table('user_assessment_scores', table => {
      table.dropForeign('userId');
      table.dropForeign('userAssessmentId');
      table.dropForeign('assessmentQuestionId');
      table.dropIndex('userId');
      table.dropIndex('userAssessmentId');
      table.dropIndex('assessmentQuestionId');
    }),
    knex.schema.table('user_assessments', table => {
      table.dropForeign('userId');
      table.dropForeign('assessmentId');
      // table.dropIndex(['userId', 'assessmentId']);
      table.dropIndex('userId');
      table.dropIndex('assessmentId');
    })
  ]);
};
