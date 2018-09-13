const { first, groupBy, isNumber, sortBy, times, mapValues } = require('lodash');
const moment = require('moment');
const knex = require('../knex');
const UserAssessment = require('./user_assessment');
const UserAssessmentScore = require('./user_assessment_score');
const ScorecardSelectedTask = require('./scorecard_selected_task');
const {
  DATE_FORMAT,
  AssessmentTypes,
  calculateAverage,
  isValidAssessmentType,
  formatBetweenFilter
} = require('./utils');

const levels = {
  [AssessmentTypes.DEPRESSION]: {
    NONE: 'No depression',
    NORMAL: 'Normal but unhappy',
    MILD: 'Mild depression',
    MODERATE: 'Moderate depression',
    SEVERE: 'Severe depression',
    EXTREME: 'Extreme depression'
  },
  [AssessmentTypes.ANXIETY]: {
    NONE: 'No anxiety',
    NORMAL: 'Normal anxiety',
    MILD: 'Mild anxiety',
    MODERATE: 'Moderate anxiety',
    SEVERE: 'Severe anxiety',
    EXTREME: 'Extreme anxiety'
  },
  [AssessmentTypes.WELL_BEING]: {
    VERY_LOW: 'Very low well-being',
    LOW: 'Low well-being',
    MODERATE: 'Moderate well-being',
    HIGH: 'High well-being',
    VERY_HIGH: 'Very high well-being'
  }
};

const Assessment = () => knex('assessments');

const fetch = (where = {}) => {
  return Assessment()
    .select()
    .where(where);
};

const findOne = (where = {}) => {
  return fetch(where).first();
};

const findById = (id, where = {}) => {
  return findOne({ ...where, id });
};

const findByType = (type) => {
  if (!isValidAssessmentType(type)) {
    const err = new Error(`Type ${type} must be valid type (${AssessmentTypes})`);

    return Promise.reject(err);
  }

  return findOne({ type });
};

const create = (params) => {
  return Assessment()
    .returning('id')
    .insert(params)
    .then(first)
    .then(id => findById(id));
};

const update = (id, params) => {
  return findById(id)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id));
};

const destroy = (id) => {
  return findById(id).delete();
};

// TODO: move to assessment question model?
const fetchQuestionsByType = (type) => {
  return Assessment()
    .select('a.type', 'a.title', 'aq.*')
    .from('assessments as a')
    .innerJoin('assessment_questions as aq', 'aq.assessmentId', 'a.id')
    .where({ 'a.type': type });
};

const fetchDepressionQuestions = () => {
  return fetchQuestionsByType(AssessmentTypes.DEPRESSION);
};

const fetchAnxietyQuestions = () => {
  return fetchQuestionsByType(AssessmentTypes.ANXIETY);
};

const fetchWellBeingQuestions = () => {
  return fetchQuestionsByType(AssessmentTypes.WELL_BEING);
};

const fetchUserAssessmentScores = (userId, where = {}, dates = {}) => {
  return Assessment()
    .select('a.type', 'a.title', 'ua.date', 'uas.*')
    .from('assessments as a')
    .innerJoin('user_assessments as ua', 'ua.assessmentId', 'a.id')
    .innerJoin('user_assessment_scores as uas', 'uas.userAssessmentId', 'ua.id')
    .where({ 'ua.userId': userId, ...where })
    .andWhere(k => k.whereBetween('ua.date', formatBetweenFilter(dates)));
};

const fetchUserAssessmentScoresByType = (type, userId, dates = {}) => {
  return fetchUserAssessmentScores(userId, { 'a.type': type }, dates);
};

const fetchUserAssessmentScoresById = (userAssessmentId, userId, dates = {}) => {
  return fetchUserAssessmentScores(userId, { 'ua.id': userAssessmentId }, dates);
};

const formatAssessment = (assessment, questions, scores = []) => {
  const { id, type, title, date } = assessment;
  const scoresByQuestionId = scores.reduce((map, s) => {
    return { ...map, [s.assessmentQuestionId]: s };
  }, {});

  const questionsWithScores = questions.map(question => {
    const { id: questionId } = question;
    const s = scoresByQuestionId[questionId] || null;

    if (s && isNumber(s.score)) {
      return { ...question, score: s.score, assessmentScoreId: s.id };
    } else {
      return question;
    }
  });

  const points = questionsWithScores.reduce((total, { score }) => {
    return isNumber(score) ? total + score : total;
  }, 0);

  return {
    id,
    type,
    title,
    points,
    score: (points / (questions.length * 4)) * 100,
    date: moment.utc(date).format(DATE_FORMAT),
    questions: questionsWithScores,
    isComplete: questionsWithScores.every(q => isNumber(q.score))
  };
};

const fetchUserAssessmentsByType = (userId, type, dates = {}) => {
  return Promise.all([
    UserAssessment.fetchByType(type, userId, dates),
    fetchQuestionsByType(type),
    fetchUserAssessmentScoresByType(type, userId, dates)
  ])
    .then(([assessments, questions, scores]) => {
      const scoresByDate = groupBy(scores, ({ date }) => {
        return moment.utc(date).format(DATE_FORMAT);
      });

      return assessments.map(assessment => {
        const { date } = assessment;
        const utc = moment.utc(date).format(DATE_FORMAT);
        const assessmentScores = scoresByDate[utc];

        return formatAssessment(assessment, questions, assessmentScores);
      });
    });
};

const fetchUserAssessments = (userId, dates = {}) => {
  const { DEPRESSION, ANXIETY, WELL_BEING } = AssessmentTypes;

  return Promise.all([
    fetchUserAssessmentsByType(userId, DEPRESSION, dates),
    fetchUserAssessmentsByType(userId, ANXIETY, dates),
    fetchUserAssessmentsByType(userId, WELL_BEING, dates)
  ])
    .then(([depression, anxiety, wellbeing]) => {
      return { depression, anxiety, wellbeing };
    });
};

const fetchUserAssessmentById = async (userAssessmentId, userId) => {
  const assessment = await UserAssessment.findById(userAssessmentId, userId);

  if (!assessment) return null;

  const scores = await fetchUserAssessmentScoresById(userAssessmentId, userId);
  const { type } = assessment;
  const questions = await fetchQuestionsByType(type);

  return formatAssessment(assessment, questions, scores);
};

const fetchUserAssessmentsByDate = async (date, userId) => {
  const userAssessments = await UserAssessment.fetchByDate(date, userId);
  const ids = userAssessments.map(a => a.id);
  const assessments = await Promise.all(
    ids.map(id => fetchUserAssessmentById(id, userId))
  );

  return assessments.reduce((mappings, assessment) => {
    const { type } = assessment;

    return { ...mappings, [type]: assessment };
  }, {});
};

// TODO: move to utils
const getDatesInRange = (startDate, endDate) => {
  const diff = moment(endDate).diff(startDate, 'days');

  if (diff < 0) {
    throw new Error(
      `Start date ${startDate} must come before end date ${endDate}!`
    );
  }

  return times(diff).map(n => {
    return moment(startDate).add(n + 1, 'days').format(DATE_FORMAT);
  });
};

const fetchUserAssessmentsByDateRange = (startDate, endDate, userId) => {
  const dates = getDatesInRange(startDate, endDate);
  const promises = dates.map(date => {
    return fetchUserAssessmentsByDate(date, userId).then(assessments => {
      return { date, assessments };
    });
  });

  return Promise.all(promises);
};

const calculateAverageScore = (assessments = []) => {
  const scores = assessments
    .filter(a => a.isComplete && isNumber(a.score))
    .map(a => a.score);

  return calculateAverage(scores);
};

const getAssessmentAverages = (assessments = []) => {
  const depression = assessments.map(a => a.depression).filter(a => a);
  const anxiety = assessments.map(a => a.anxiety).filter(a => a);
  const wellbeing = assessments.map(a => a.wellbeing).filter(a => a);

  return {
    depression: calculateAverageScore(depression),
    anxiety: calculateAverageScore(anxiety),
    wellbeing: calculateAverageScore(wellbeing)
  };
};

const findOrCreateUserAssessment = (type, date, userId) => {
  return findByType(type)
    .then(assessment => {
      const assessmentId = assessment && assessment.id;

      if (!assessmentId) {
        throw new Error(`Invalid assessment type ${type}`);
      }

      return UserAssessment.findOrCreate({ assessmentId, date }, userId);
    });
};

const updateScore = (id, questionId, score, userId) => {
  const where = {
    userAssessmentId: id,
    assessmentQuestionId: questionId
  };

  return UserAssessmentScore.createOrUpdate(where, { score }, userId);
};

const formatStats = (assessments = []) => {
  return assessments
    .sort((x, y) => Number(new Date(x.date)) - Number(new Date(y.date)))
    .map(assessment => {
      const { date, points } = assessment;
      const timestamp = Number(new Date(date));

      return [timestamp, points];
    });
};

const fetchStats = (userId, dates = {}) => {
  return fetchUserAssessments(userId, dates)
    .then(({ wellbeing = [], anxiety = [], depression = [] }) => {
      return {
        wellbeing: formatStats(wellbeing),
        anxiety: formatStats(anxiety),
        depression: formatStats(depression)
      };
    });
};

const extractAssessmentsScores = (assessments = {}) => {
  const { depression, anxiety, wellbeing } = assessments;

  return {
    depression: (depression && depression.score) || null,
    anxiety: (anxiety && anxiety.score) || null,
    wellbeing: (wellbeing && wellbeing.score) || null
  };
};

const fetchWeekStats = (userId, date = moment().format(DATE_FORMAT)) => {
  console.log('Fetching assessment week stats for:', moment(date).format(DATE_FORMAT));
  const today = moment(date);
  const day = today.day();
  const thisSunday = moment(today).subtract(day === 0 ? 7 : day, 'days');
  const lastSunday = moment(thisSunday).subtract(1, 'week');
  const thisWeek = [thisSunday.format(DATE_FORMAT), today.format(DATE_FORMAT)];
  const lastWeek = [lastSunday.format(DATE_FORMAT), thisSunday.format(DATE_FORMAT)];

  return Promise.all([
    fetchUserAssessmentsByDateRange(...thisWeek, userId),
    fetchUserAssessmentsByDateRange(...lastWeek, userId)
  ])
    .then(([current, past]) => {
      const {
        assessments: todaysAssessments
      } = current.find(a => a && a.date === date) || {};
      const thisWeeksAssessments = current.map(r => r.assessments);
      const lastweeksAssessments = past.map(r => r.assessments);

      return {
        today: extractAssessmentsScores(todaysAssessments),
        thisWeek: getAssessmentAverages(thisWeeksAssessments),
        lastWeek: getAssessmentAverages(lastweeksAssessments)
      };
    });
};

// TODO: DRY up (see `fetchWeekStats` above)
const fetchMonthStats = (userId, date = moment().format(DATE_FORMAT)) => {
  const today = moment(date);
  const start = moment(today).startOf('month');
  const previous = moment(start).subtract(1, 'month');
  // const thisMonth = [start.format(DATE_FORMAT), today.format(DATE_FORMAT)];
  // const lastMonth = [previous.format(DATE_FORMAT), start.format(DATE_FORMAT)];
  const thisMonth = [
    moment(today).subtract(1, 'month').format(DATE_FORMAT),
    today.format(DATE_FORMAT)
  ];
  const lastMonth = [
    moment(today).subtract(2, 'month').format(DATE_FORMAT),
    moment(today).subtract(1, 'month').format(DATE_FORMAT)
  ];

  return Promise.all([
    fetchUserAssessmentsByDateRange(...thisMonth, userId),
    fetchUserAssessmentsByDateRange(...lastMonth, userId)
  ])
    .then(([current, past]) => {
      const {
        assessments: todaysAssessments
      } = current.find(a => a && a.date === date) || {};
      const thisMonthsAssessments = current.map(r => r.assessments);
      const lastMonthsAssessments = past.map(r => r.assessments);

      return {
        today: extractAssessmentsScores(todaysAssessments),
        thisMonth: getAssessmentAverages(thisMonthsAssessments),
        lastMonth: getAssessmentAverages(lastMonthsAssessments)
      };
    });
};

const fetchCompletedDays = (userId, where = {}, dates = {}) => {
  return Assessment()
    .select('a.type', 'ua.date')
    .count('uas.*')
    .from('assessments as a')
    .innerJoin('user_assessments as ua', 'ua.assessmentId', 'a.id')
    .innerJoin('user_assessment_scores as uas', 'uas.userAssessmentId', 'ua.id')
    .where({ ...where, 'ua.userId': userId })
    .andWhere(k => k.whereBetween('ua.date', formatBetweenFilter(dates)))
    .groupBy('ua.date', 'a.type')
    .orderBy('ua.date', 'desc')
    .then(result => {
      return result
        .map(r => {
          return { ...r, count: Number(r.count) };
        })
        .filter(r => r.count > 0);
    });
};

const fetchCompletedDaysByType = (type, userId, dates = {}) => {
  const where = isValidAssessmentType(type) ? { 'a.type': type } : {};

  return fetchCompletedDays(userId, where, dates);
};

const fetchQuestionStats = (type, userId, dates = {}) => {
  return UserAssessmentScore.fetchScoresByQuestion(type, userId, dates);
};

const fetchStatsPerQuestion = (userId, dates = {}) => {
  return UserAssessmentScore.fetchStatsPerQuestion(userId, dates);
};

const fetchScoresByDate = (userId, where = {}, dates = {}) => {
  return Assessment()
    .select('a.type', 'ua.date')
    .sum('uas.score as score')
    .from('assessments as a')
    .innerJoin('user_assessments as ua', 'ua.assessmentId', 'a.id')
    .innerJoin('user_assessment_scores as uas', 'uas.userAssessmentId', 'ua.id')
    .where({ ...where, 'ua.userId': userId })
    .andWhere(k => k.whereBetween('ua.date', formatBetweenFilter(dates)))
    .groupBy('ua.date', 'a.type')
    .orderBy('ua.date', 'desc')
    .then(result => {
      return result.map(r => {
        return { ...r, score: Number(r.score) };
      });
    });
};

const fetchAveragesByMonth = (userId) => {
  return fetchScoresByDate(userId)
    .then(results => {
      const byType = groupBy(results, 'type');

      return mapValues(byType, scores => {
        // FIXME: group by year as well
        const byMonth = groupBy(scores, s => moment(s.date).format('MMMM'));

        return Object.keys(byMonth).map(month => {
          const values = byMonth[month];
          const total = values.reduce((acc, s) => acc + s.score, 0);

          return {
            month,
            average: (total / values.length)
          };
        });
      });
    });
};

const fetchScoresByDayOfWeek = (type, userId, dates = {}) => {
  const filter = isValidAssessmentType(type) ? { 'a.type': type } : {};

  return fetchScoresByDate(userId, filter, dates)
    .then(result => {
      return result.reduce((map, { date, score }) => {
        const day = moment(date).format('dddd');
        const s = Number(score);

        return {
          ...map,
          [day]: (map[day] || []).concat(s)
        };
      }, {});
    });
};

const getDepressionLevelByScore = (score) => {
  const l = levels[AssessmentTypes.DEPRESSION];

  if (score <= 5) {
    return l.NONE;
  } else if (score > 5 && score <= 10) {
    return l.NORMAL;
  } else if (score > 10 && score <= 25) {
    return l.MILD;
  } else if (score > 25 && score <= 50) {
    return l.MODERATE;
  } else if (score > 50 && score <= 75) {
    return l.SEVERE;
  } else {
    return l.EXTREME;
  }
};

const getAnxietyLevelByScore = (score) => {
  const l = levels[AssessmentTypes.ANXIETY];

  if (score <= 5) {
    return l.NONE;
  } else if (score > 5 && score <= 10) {
    return l.NORMAL;
  } else if (score > 10 && score <= 25) {
    return l.MILD;
  } else if (score > 25 && score <= 50) {
    return l.MODERATE;
  } else if (score > 50 && score <= 75) {
    return l.SEVERE;
  } else {
    return l.EXTREME;
  }
};

const getWellnessLevelByScore = (score) => {
  const l = levels[AssessmentTypes.WELL_BEING];

  if (score <= 15) {
    return l.VERY_LOW;
  } else if (score > 15 && score <= 35) {
    return l.LOW;
  } else if (score > 35 && score <= 50) {
    return l.MODERATE;
  } else if (score > 50 && score <= 65) {
    return l.HIGH;
  } else {
    return l.VERY_HIGH;
  }
};

const getLevelByScore = (type, score) => {
  switch (type) {
    case AssessmentTypes.DEPRESSION:
      return getDepressionLevelByScore(score);
    case AssessmentTypes.ANXIETY:
      return getAnxietyLevelByScore(score);
    case AssessmentTypes.WELL_BEING:
      return getWellnessLevelByScore(score);
    default:
      throw new Error(`Invalid type ${type}!`);
  }
};

const fetchScoreRangeFrequency = (type, userId, dates = {}) => {
  if (!isValidAssessmentType(type)) {
    return Promise.reject(new Error(`Invalid type ${type}!`));
  }

  const filter = { 'a.type': type };
  const l = levels[type];
  const init = Object.values(l).reduce((acc, key) => {
    return { ...acc, [key]: 0 };
  }, {});

  return fetchScoresByDate(userId, filter, dates)
    .then(results => {
      return results.reduce((map, { score }) => {
        const s = Number(score);
        const level = getLevelByScore(type, s);

        return {
          ...map,
          [level]: (map[level] || 0) + 1
        };
      }, init);
    });
};

const fetchScoresByTask = (type, userId, dates = {}) => {
  if (!isValidAssessmentType(type)) {
    return Promise.reject(new Error(`Invalid type ${type}!`));
  }

  const filter = { 'a.type': type };

  return Promise.all([
    fetchScoresByDate(userId, filter, dates),
    ScorecardSelectedTask.fetchWithDates(userId, dates)
  ])
    .then(([scoresByDate, tasksByDate]) => {
      const mappings = scoresByDate.reduce((acc, { date, score }) => {
        return { ...acc, [date]: score };
      }, {});

      return Object.keys(tasksByDate).map(task => {
        const dates = tasksByDate[task];
        const scores = dates
          .filter(date => isNumber(mappings[date]))
          .map(date => mappings[date]);

        return {
          task,
          data: {
            dates,
            scores,
            average: calculateAverage(scores)
          }
        };
      });
    })
    .then(stats => {
      return stats.filter(({ data = {} }) => {
        const { scores = [] } = data;

        return scores.length > 0;
      });
    })
    .then(stats => sortBy(stats, 'data.average'));
};

module.exports = {
  levels,
  AssessmentTypes,
  fetch,
  findById,
  create,
  update,
  destroy,
  fetchDepressionQuestions,
  fetchAnxietyQuestions,
  fetchWellBeingQuestions,
  fetchUserAssessmentsByType,
  fetchUserAssessments,
  fetchUserAssessmentById,
  fetchUserAssessmentsByDate,
  findOrCreateUserAssessment,
  updateScore,
  fetchStats,
  fetchWeekStats,
  fetchMonthStats,
  fetchCompletedDays,
  fetchCompletedDaysByType,
  fetchQuestionStats,
  fetchStatsPerQuestion,
  fetchScoresByDate,
  fetchAveragesByMonth,
  fetchScoresByDayOfWeek,
  getDepressionLevelByScore,
  getAnxietyLevelByScore,
  getWellnessLevelByScore,
  getLevelByScore,
  fetchScoreRangeFrequency,
  fetchScoresByTask
};
