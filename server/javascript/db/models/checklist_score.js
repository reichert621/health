const knex = require('../knex.js');
const { first, groupBy, map } = require('lodash');

const ChecklistScore = () => knex('checklist_scores');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) =>
  ChecklistScore()
    .select()
    .where(merge(where, { userId }));

const findOne = (where, userId) =>
  fetch(where, userId)
    .first();

const fetchScoresByCategory = (userId) => {
  return ChecklistScore()
    .select('c.date', 'cq.category', 'cs.score', 'cs.userId')
    .from('checklist_scores as cs')
    .innerJoin('checklists as c', 'cs.checklistId', 'c.id')
    .innerJoin('checklist_questions as cq', 'cs.checklistQuestionId', 'cq.id')
    .where({ 'cs.userId': userId })
    .then(results => {
      return groupBy(results, 'category');
    });
};

const fetchScoresByQuestion = (userId) => {
  return ChecklistScore()
    .select('c.date', 'cq.text', 'cs.score', 'cs.userId')
    .from('checklist_scores as cs')
    .innerJoin('checklists as c', 'cs.checklistId', 'c.id')
    .innerJoin('checklist_questions as cq', 'cs.checklistQuestionId', 'cq.id')
    .where({ 'cs.userId': userId })
    .then(results => groupBy(results, 'text'))
    .then(scoresByQuestion => {
      return Object.keys(scoresByQuestion)
        .map(question => {
          const scores = map(scoresByQuestion[question], 'score');
          const count = scores.length;
          const total = scores.reduce((sum, n) => sum + n, 0);
          const average = (total / count);

          return { question, scores, count, total, average };
        })
        .sort((x, y) => y.total - x.total);
    });
};

const fetchByChecklistId = (checklistId, userId, where = {}) =>
  fetch(merge(where, { checklistId }), userId);

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { id }), userId);

const create = (params, userId) =>
  ChecklistScore()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const update = (id, params, userId) =>
  findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroy = (id, userId) =>
  findById(id, userId)
    .delete();

module.exports = {
  fetch,
  findById,
  fetchScoresByCategory,
  fetchScoresByQuestion,
  fetchByChecklistId,
  create,
  update,
  destroy
};
