const { first } = require('lodash');
const knex = require('../knex');
const Scorecard = require('./scorecard');
const { calculateAverage } = require('./utils');

const AssessmentQuestion = () => knex('assessment_questions');

const fetch = (where = {}) => {
  return AssessmentQuestion()
    .select()
    .where(where);
};

const findOne = (where = {}) => {
  return fetch(where).first();
};

const findById = (id, where = {}) => {
  return findOne({ ...where, id });
};

const create = params => {
  return AssessmentQuestion()
    .returning('id')
    .insert(params)
    .then(first)
    .then(id => findById(id));
};

const update = (id, params) => {
  return findById(id)
    .update(params)
    .then(count => count > 0)
    .then(success => findById(id));
};

const destroy = id => {
  return findById(id).delete();
};

const getScoreDescription = score => {
  return (
    [
      'disagree',
      'somewhat agree',
      'agree',
      'strongly agree',
      'very strongly agree'
    ][score] || 'unanswered'
  );
};

const fetchQuestionScores = userId => {
  return AssessmentQuestion()
    .select('aq.text', 'uas.score', 'ua.date', 'aq.id as questionId')
    .from('assessment_questions as aq')
    .innerJoin(
      'user_assessment_scores as uas',
      'uas.assessmentQuestionId',
      'aq.id'
    )
    .innerJoin('user_assessments as ua', 'uas.userAssessmentId', 'ua.id')
    .where({ 'uas.userId': userId });
};

const fetchScoresById = (id, userId) => {
  return AssessmentQuestion()
    .select('aq.text', 'uas.score', 'ua.date', 'aq.id as questionId')
    .from('assessment_questions as aq')
    .innerJoin(
      'user_assessment_scores as uas',
      'uas.assessmentQuestionId',
      'aq.id'
    )
    .innerJoin('user_assessments as ua', 'uas.userAssessmentId', 'ua.id')
    .where({ 'uas.userId': userId, 'aq.id': id });
};

const fetchScoreStatsById = (id, userId) => {
  return fetchScoresById(id, userId).then(results => {
    const total = results.length;
    const scores = results.map(r => Number(r.score));
    const average = calculateAverage(scores);
    const frequencies = results.reduce((acc, { score }) => {
      return {
        ...acc,
        [score]: (acc[score] || 0) + 1
      };
    }, {});

    return {
      average,
      count: total,
      frequencies: Object.keys(frequencies).map(score => {
        const count = frequencies[score];

        return {
          score,
          count,
          description: getScoreDescription(score),
          percentage: count / total
        };
      })
    };
  });
};

// Gets list of unique tasks
const getQuestionStatTasks = (stats = {}) => {
  return Object.keys(
    Object.values(stats).reduce((merged, obj) => {
      return { ...merged, ...obj };
    }, {})
  );
};

// Maps tasks to question scores, e.g. `Exercise: [1, 3]`
const getTaskQuestionScores = (tasks, stats = {}) => {
  const keys = Object.keys(stats);

  return tasks.reduce((acc, task) => {
    const existing = keys.filter(k => {
      return stats[k] && stats[k][task];
    });

    return { ...acc, [task]: existing };
  }, {});
};

// Displays tasks that only occur within one score
// (which may indicate level of impact)
const getUniqueTasksByScore = (stats = {}) => {
  const tasks = getQuestionStatTasks(stats);
  const found = getTaskQuestionScores(tasks, stats);

  return Object.keys(found).reduce((acc, task) => {
    const items = found[task];

    if (items.length && items.length === 1) {
      const [item] = items;

      return {
        ...acc,
        [item]: (acc[item] || []).concat(task)
      };
    } else {
      return acc;
    }
  }, {});
};

// Counts how often each score occurs for the given question
const getQuestionScoreFrequencies = (questionScores = []) => {
  return questionScores.reduce((acc, { score }) => {
    return { ...acc, [score]: (acc[score] || 0) + 1 };
  }, {});
};

// Fetch how often each task occurs within each score
// e.g. { '1': { 'Exercise': 7 }, '2': { 'Code': 4 } }
const fetchTaskCountByScore = async (userId, questionScores = []) => {
  const dates = questionScores.map(s => s.date);
  const tasksByDate = await Scorecard.fetchSelectedTasksByDates(userId, dates);

  return questionScores.reduce((acc, { date, score }) => {
    const tasks = tasksByDate[date];
    const bucket = acc[score] || {};
    const updated = tasks.reduce((mappings, task) => {
      const { description, category } = task;
      const key = `${category}: ${description}`;

      return { ...mappings, [key]: (mappings[key] || 0) + 1 };
    }, bucket);

    return { ...acc, [score]: updated };
  }, {});
};

// Format stats to include percentage
const formatQuestionScoreTaskStats = (stats, frequencies = {}) => {
  return Object.keys(stats).reduce((acc, score) => {
    const mappings = stats[score];
    const total = frequencies[score];
    const formatted = Object.keys(mappings)
      .map(task => {
        return {
          task,
          count: mappings[task],
          percentage: mappings[task] / total
        };
      })
      .sort((x, y) => y.percentage - x.percentage);

    return {
      ...acc,
      [score]: formatted
    };
  }, {});
};

const fetchStatsById = async (id, userId) => {
  const question = await findById(id);
  const questionScores = await fetchScoresById(id, userId);
  const frequencies = getQuestionScoreFrequencies(questionScores);
  const stats = await fetchTaskCountByScore(userId, questionScores);

  return {
    question,
    frequencies,
    stats: formatQuestionScoreTaskStats(stats, frequencies),
    uniqs: getUniqueTasksByScore(stats)
  };
};

module.exports = {
  fetch,
  findById,
  create,
  update,
  destroy,
  fetchStatsById
};
