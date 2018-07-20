const { first, map, groupBy } = require('lodash');
const knex = require('../knex');
const { isValidAssessmentType, formatBetweenFilter } = require('./utils');

const UserAssessmentScore = () => knex('user_assessment_scores');

const fetch = (where = {}, userId) => {
  return UserAssessmentScore()
    .select()
    .where({ ...where, userId });
};

const findOne = (where = {}, userId) => {
  return fetch(where, userId).first();
};

const findById = (id, userId, where = {}) => {
  return findOne({ ...where, id }, userId);
};

const create = (params, userId) => {
  return UserAssessmentScore()
    .returning('id')
    .insert({ ...params, userId })
    .then(first)
    .then(id => findById(id, userId));
};

const findOrCreate = (params, userId) => {
  return findOne(params, userId)
    .then(found => {
      if (found) {
        return found;
      }

      return create(params, userId);
    });
};

const update = (id, updates, userId) => {
  return findById(id, userId)
    .update(updates)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const createOrUpdate = (where, updates = {}, userId) => {
  return findOne(where, userId)
    .then(result => {
      const id = result && result.id;
      const params = { ...where, ...updates };

      if (id) {
        return update(id, updates, userId);
      } else {
        return create(params, userId);
      }
    });
};

const destroy = (id, userId) => {
  return findById(id, userId).delete();
};

const fetchScoresByQuestion = (type, userId, dates = {}) => {
  if (!isValidAssessmentType(type)) {
    return Promise.reject(new Error(`Invalid type ${type}!`));
  }

  return UserAssessmentScore()
    .select(
      'ua.date', 'aq.text', 'aq.category', 'uas.score', 'ua.userId', 'a.type'
    )
    .from('user_assessment_scores as uas')
    .innerJoin('user_assessments as ua', 'uas.userAssessmentId', 'ua.id')
    .innerJoin('assessment_questions as aq', 'uas.assessmentQuestionId', 'aq.id')
    .innerJoin('assessments as a', 'ua.assessmentId', 'a.id')
    .where({ 'ua.userId': userId, 'a.type': type })
    .andWhere(k => k.whereBetween('ua.date', formatBetweenFilter(dates)))
    .then(results => {
      // TODO: what's the best way to include the category + question?
      const SEPARATOR = '::';
      const scoresByQuestion = groupBy(results, ({ category, text }) => {
        return [category, text].join(SEPARATOR);
      });

      return Object.keys(scoresByQuestion)
        .map(key => {
          const [category, question] = key.split(SEPARATOR);
          const scores = map(scoresByQuestion[key], 'score');
          const count = scores.length;
          const total = scores.reduce((sum, n) => sum + n, 0);
          const average = (total / count);

          return { question, category, count, total, average };
        })
        .sort((x, y) => y.total - x.total);
    });
};

module.exports = {
  fetch,
  findById,
  create,
  findOrCreate,
  update,
  createOrUpdate,
  destroy,
  fetchScoresByQuestion
};
