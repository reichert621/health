const knex = require('../knex.js');
const { first, isNumber } = require('lodash');
const moment = require('moment');
const ChecklistQuestion = require('./checklist_question');
const ChecklistScore = require('./checklist_score');
const ScorecardSelectedTask = require('./scorecard_selected_task');

// Depression levels
const levels = {
  NONE: 'No depression',
  NORMAL: 'Normal but unhappy',
  MILD: 'Mild depression',
  MODERATE: 'Moderate depression',
  SEVERE: 'Severe depression',
  EXTREME: 'Extreme depression'
};

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
      const { date } = checklist;
      const utc = moment.utc(date).format('YYYY-MM-DD');
      const scoresByQuestion = scores.reduce((map, score) => {
        const { checklistQuestionId: questionId } = score;

        return merge(map, { [questionId]: score });
      }, {});

      return merge(checklist, {
        date: utc,
        _date: date,
        questions: questions.map(question => {
          const s = scoresByQuestion[question.id];

          if (s && isNumber(s.score)) {
            return merge(question, { score: s.score, checklistScoreId: s.id });
          } else {
            return question;
          }
        })
      });
    });

const create = (params, userId) => {
  return Checklist()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));
};

const createWithScores = async (params, userId) => {
  const { date, scores = [] } = params;
  const checklist = await create({ date }, userId);
  const { id: checklistId } = checklist;
  const promises = scores.map(({ score, checklistQuestionId }) => {
    const checklistScore = {
      score,
      checklistId,
      checklistQuestionId
    };

    return ChecklistScore.create(checklistScore, userId);
  });

  await Promise.all(promises);

  return checklist;
};

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const updateScores = (id, params, userId) => {
  const { scores: checklistScores } = params;
  const promises = checklistScores.map(checklistScore => {
    const { checklistScoreId, score } = checklistScore;

    if (checklistScoreId) {
      return ChecklistScore.update(checklistScoreId, { score }, userId);
    } else {
      return ChecklistScore.create(checklistScore, userId);
    }
  });

  return Promise.all(promises);
};

const fetchWithPoints = (where = {}, userId) => {
  return fetch(where, userId)
    .then(checklists => {
      const promises = checklists.map(checklist => {
        const { id, date } = checklist;
        const utc = moment.utc(date).format('YYYY-MM-DD');

        return ChecklistScore.fetchByChecklistId(id, userId)
          .then(checklistScores => {
            const points = checklistScores.reduce((total, { score }) => {
              return isNumber(score) ? total + score : total;
            }, 0);

            return merge(checklist, { points, date: utc, _date: date });
          });
      });

      return Promise.all(promises);
    });
};

const fetchCompletedDays = (userId) => {
  return Checklist()
    .select('c.date')
    .count('cs.*')
    .from('checklists as c')
    .innerJoin('checklist_scores as cs', 'cs.checklistId', 'c.id')
    .where({ 'c.userId': userId })
    .groupBy('c.date')
    .orderBy('c.date', 'desc')
    .then(result => {
      return result
        .map(r => {
          return merge(r, { count: Number(r.count) });
        })
        .filter(r => r.count > 0);
    });
};

const fetchScoresByDate = (userId) => {
  return Checklist()
    .select('c.date')
    .sum('cs.score as score')
    .from('checklists as c')
    .innerJoin('checklist_scores as cs', 'cs.checklistId', 'c.id')
    .where({ 'c.userId': userId })
    .groupBy('c.date')
    .orderBy('c.date', 'desc')
    .then(result => {
      return result.map(r => merge(r, { score: Number(r.score) }));
    });
};

const fetchScoresByDayOfWeek = (userId) => {
  return fetchScoresByDate(userId)
    .then(result => {
      return result.reduce((map, { date, score }) => {
        const day = moment(date).format('dddd');
        const s = Number(score);

        return merge(map, {
          [day]: (map[day] || []).concat(s)
        });
      }, {});
    });
};

// TODO: move to helpers/utils
const calculateAverage = (nums = []) => {
  if (!nums || !nums.length) return 0;

  const sum = nums.reduce((total, n) => total + n, 0);
  const count = nums.length;

  return sum / count;
};

const fetchScoresByTask = (userId) => {
  return Promise.all([
    fetchScoresByDate(userId),
    ScorecardSelectedTask.fetchWithDates(userId)
  ])
    .then(([scoresByDate, tasksByDate]) => {
      const mappings = scoresByDate.reduce((map, { date, score }) => {
        return merge(map, { [date]: score });
      }, {});

      return Object.keys(tasksByDate).map(task => {
        const dates = tasksByDate[task];
        const scores = dates
          .filter(date => isNumber(mappings[date]))
          .map(date => mappings[date]);

        return { task, score: calculateAverage(scores) };
      });
    });
};

const getDepressionLevelByScore = (score) => {
  if (score <= 5) {
    return levels.NONE;
  } else if (score >= 6 && score <= 10) {
    return levels.NORMAL;
  } else if (score >= 11 && score <= 25) {
    return levels.MILD;
  } else if (score >= 26 && score <= 50) {
    return levels.MODERATE;
  } else if (score >= 51 && score <= 75) {
    return levels.SEVERE;
  } else {
    return levels.EXTREME;
  }
};

const fetchScoreRangeFrequency = (userId) => {
  const init = {
    [levels.NONE]: 0,
    [levels.NORMAL]: 0,
    [levels.MILD]: 0,
    [levels.MODERATE]: 0,
    [levels.SEVERE]: 0,
    [levels.EXTREME]: 0
  };

  return fetchScoresByDate(userId)
    .then(results => {
      return results.reduce((map, { score }) => {
        const s = Number(score);
        const level = getDepressionLevelByScore(s);

        return merge(map, {
          [level]: (map[level] || 0) + 1
        });
      }, init);
    });
};

const fetchQuestionStats = (userId) => {
  return ChecklistScore.fetchScoresByQuestion(userId)
    .then(statsPerQuestion => {
      // TODO: figure out a use for this data
      return statsPerQuestion;
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
        .sort((x, y) => Number(new Date(x.date)) - Number(new Date(y.date)))
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
  createWithScores,
  update,
  updateScores,
  fetchWithPoints,
  fetchCompletedDays,
  fetchScoresByDate,
  fetchScoresByDayOfWeek,
  fetchScoresByTask,
  fetchScoreRangeFrequency,
  fetchQuestionStats,
  fetchStats,
  destroy
};
