const knex = require('../knex.js');
const {
  first,
  groupBy,
  map,
  isNumber,
  values,
  flatten,
  uniq
} = require('lodash');
const { getDateRange, getDaysBetween, getCombinations } = require('./utils');

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
    .then(results => {
      const scoresByQuestion = groupBy(results, 'text');

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

// Fetches mood chart stats
const fetchStatsPerQuestion = (userId) => {
  return ChecklistScore()
    .select('c.date', 'cq.text', 'cs.score', 'cs.userId')
    .from('checklist_scores as cs')
    .innerJoin('checklists as c', 'cs.checklistId', 'c.id')
    .innerJoin('checklist_questions as cq', 'cs.checklistQuestionId', 'cq.id')
    .where({ 'cs.userId': userId })
    .then(results => {
      const dates = results.map(r => r.date);
      const [start, end] = getDateRange(dates);
      const days = getDaysBetween(start, end);
      const scoresByQuestion = groupBy(results, 'text');

      return Object.keys(scoresByQuestion)
        .map(question => {
          const stats = scoresByQuestion[question];
          const scores = stats.reduce((acc, { date, score }) => {
            const timestamp = Number(date);

            return merge(acc, {
              [timestamp]: (acc[timestamp] || 0) + score
            });
          }, {});

          return {
            question,
            data: days.map(day => {
              const timestamp = Number(day); // TODO: format date instead of unix?
              const score = isNumber(scores[timestamp]) ? scores[timestamp] : null;

              return [timestamp, score];
            })
          };
        });
    });
};

// TODO: currently unused
const getRelatedMoodStats = (sets = []) => {
  const mappings = sets.reduce((acc, set) => {
    const combos = getCombinations(set).filter(c => c.length > 1);

    combos.forEach(combo => {
      const key = combo.sort().join('|');

      acc[key] = (acc[key] || 0) + 1;
    });

    return acc;
  }, {});

  return Object.keys(mappings)
    .filter(key => {
      const moods = key.split('|');

      return mappings[key] > 30 && moods.length > 2;
    })
    .map(key => {
      return {
        moods: key.split('|'),
        count: mappings[key]
      };
    })
    .sort((x, y) => y.count - x.count);
};

// TODO: currently unused
const fetchRelatedQuestions = (userId) => {
  return ChecklistScore()
    .select('c.date', 'cq.text', 'cs.score', 'cs.userId')
    .from('checklist_scores as cs')
    .innerJoin('checklists as c', 'cs.checklistId', 'c.id')
    .innerJoin('checklist_questions as cq', 'cs.checklistQuestionId', 'cq.id')
    .where({ 'cs.userId': userId })
    .then(results => {
      const moodsByDate = results.reduce((acc, { text, score, date }) => {
        if (score === 0) return acc;

        return merge(acc, {
          [date]: (acc[date] || []).concat(text)
        });
      }, {});

      const sets = values(moodsByDate);
      const keys = uniq(flatten(sets));
      const mappings = keys.reduce((acc, key) => merge(acc, { [key]: {} }), {});

      const result = sets.reduce((acc, set) => {
        set.forEach(current => {
          set.forEach(question => {
            if (current !== question) {
              acc[current][question] = (acc[current][question] || 0) + 1;
            }
          });
        });

        return acc;
      }, mappings);

      return result;
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
  fetchStatsPerQuestion,
  fetchByChecklistId,
  create,
  update,
  destroy
};
