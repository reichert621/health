const knex = require('../knex.js');
const { first, groupBy, isNumber } = require('lodash');
const ChecklistQuestion = require('./checklist_question');
const ChecklistScore = require('./checklist_score');

const Checklist = () => knex('checklists');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) =>
  Checklist()
    .select()
    .where(merge(where, { userId }));

const findOne = (where, userId) =>
  fetch(where, userId)
    .first();

// TODO: rename
const findById = (id, userId, where = {}) =>
  Promise.all([
    findOne(merge(where, { id }), userId),
    ChecklistQuestion.fetch(),
    ChecklistScore.fetchByChecklistId(id, userId)
  ])
    .then(([checklist, questions, scores]) => {
      const scoresByQuestion = scores.reduce((map, score) => {
        const { checklistQuestionId: questionId } = score;

        return merge(map, { [questionId]: score });
      }, {});

      return merge(checklist, {
        questions: questions.map(question => {
          const s = scoresByQuestion[question.id];

          if (s && isNumber(s.score)) {
            return merge(question, { score: s.score, checklistScoreId: s.id })
          } else {
            return question;
          }
        })
       });
    });

const create = (params, userId) =>
  Checklist()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const updateScores = (id, params, userId) => {
  const { date, scores: checklistScores } = params;

  return update(id, { date }, userId)
    .then(checklist => {
      const promises = checklistScores.map(checklistScore => {
        const { checklistScoreId, score } = checklistScore;

        if (checklistScoreId) {
          return ChecklistScore.update(checklistScoreId, { score }, userId);
        } else {
          return ChecklistScore.create(checklistScore, userId);
        }
      });

      return Promise.all(promises);
    });
};

const fetchStats = (userId) => {
  return fetch({}, userId)
    .then(checklists => {
      const promises = checklists.map(checklist => {
        const { id } = checklist;

        return ChecklistScore.fetchByChecklistId(id, userId)
          .then(scores => {
            return merge(checklist, { scores });
          });
      });

      return Promise.all(promises);
    })
    .then(checklists => {
      const stats = checklists
        .sort((x, y) => Number(x.date) - Number(y.date))
        .map(checklist => {
          const { date, scores = [] } = checklist;
          const timestamp = Number(new Date(date));
          const total = scores.reduce((sum, s) => sum + Number(s.score), 0);

          return [timestamp, total];
        });

      return stats;
    });
};

const destroy = (id, userId) =>
  findById(id, userId)
    .delete();

module.exports = {
  fetch,
  findById,
  create,
  update,
  updateScores,
  fetchStats,
  destroy
};
