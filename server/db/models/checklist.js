const knex = require('../knex.js');
const { first, isNumber, sortBy, times } = require('lodash');
const moment = require('moment');
const ChecklistQuestion = require('./checklist_question');
const ChecklistScore = require('./checklist_score');
const ScorecardSelectedTask = require('./scorecard_selected_task');
const User = require('./user');
const Assessment = require('./assessment');
const UserAssessment = require('./user_assessment');
const UserAssessmentScore = require('./user_assessment_score');
const { DATE_FORMAT } = require('./utils');

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

const fetchQuestionScores = (checklistId, userId) => {
  return Promise.all([
    ChecklistQuestion.fetch(),
    ChecklistScore.fetchByChecklistId(checklistId, userId)
  ])
    .then(([questions, scores]) => {
      const scoresByQuestion = scores.reduce((map, score) => {
        const { checklistQuestionId: questionId } = score;

        return merge(map, { [questionId]: score });
      }, {});

      return questions.map(question => {
        const s = scoresByQuestion[question.id];

        if (s && isNumber(s.score)) {
          return merge(question, { score: s.score, checklistScoreId: s.id });
        } else {
          return question;
        }
      });
    });
};

// TODO: rename
const findById = async (id, userId, where = {}) => {
  const checklist = await findOne(merge(where, { id }), userId);
  const questions = await fetchQuestionScores(id, userId);
  const { date } = checklist;
  const utc = moment.utc(date).format('YYYY-MM-DD');
  const points = questions.reduce((total, { score }) => {
    return isNumber(score) ? total + score : total;
  }, 0);

  return merge(checklist, {
    questions,
    points,
    date: utc,
    _date: date
  });
};

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

const findOrCreate = (params, userId) => {
  return findOne(params, userId)
    .then(found => {
      if (found) {
        return found;
      }

      return create(params, userId);
    });
};

const findByDate = async (date, userId, where = {}) => {
  if (!date) {
    throw new Error('Date is required!');
  }

  const checklist = await findOne(merge(where, { date }), userId);

  if (!checklist) return null;

  const { id: checklistId } = checklist;
  const questions = await fetchQuestionScores(checklistId, userId);
  const utc = moment.utc(date).format('YYYY-MM-DD');
  const isComplete = questions.every(q => isNumber(q.score));
  const points = questions.reduce((total, { score }) => {
    return isNumber(score) ? total + score : total;
  }, 0);

  return merge(checklist, {
    questions,
    points,
    isComplete,
    date: utc,
    _date: date
  });
};

const findOrCreateByDate = (date, userId) => {
  return findOrCreate({ date }, userId)
    .then(checklist => findByDate(date, userId));
};

const migrate = async (date, userId) => {
  const checklist = await findByDate(date, userId);

  if (!checklist) return null;

  const { questions: questionsWithScores = [] } = checklist;
  const questions = await Assessment.fetchDepressionQuestions();
  const { assessmentId } = first(questions);
  const {
    id: userAssessmentId
  } = await UserAssessment.findOrCreate({ userId, assessmentId, date }, userId);
  const scores = questionsWithScores.map(question => {
    const { score, text } = question;
    const match = questions.find(q => q.text === text);

    if (!match || !isNumber(score)) return Promise.resolve(null);

    const { id: assessmentQuestionId } = match;

    return UserAssessmentScore.findOrCreate({
      userAssessmentId,
      assessmentQuestionId,
      userId,
      score
    }, userId);
  });

  return Promise.all(scores);
};

const migrateByUser = (userId) => {
  return fetch({}, userId)
    .then(checklists => {
      const dates = checklists.map(c => c.date);
      const promises = dates.map(date => migrate(date, userId));

      return Promise.all(promises);
    });
};

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const updateScore = (id, questionId, score, userId) => {
  const where = {
    checklistId: id,
    checklistQuestionId: questionId
  };

  return ChecklistScore.createOrUpdate(where, { score }, userId);
};

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

        return fetchQuestionScores(id, userId)
          .then(questions => {
            const points = questions.reduce((total, { score }) => {
              return isNumber(score) ? total + score : total;
            }, 0);

            return merge(checklist, {
              questions,
              points,
              date: utc,
              _date: date
            });
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

const fetchAllCompleted = (userIds = []) => {
  return Checklist()
    .select('c.date', 'u.username')
    .count('cs.*')
    .from('checklists as c')
    .innerJoin('checklist_scores as cs', 'cs.checklistId', 'c.id')
    .innerJoin('users as u', 'u.id', 'c.userId')
    .whereIn('u.id', userIds)
    .groupBy('c.date', 'u.username')
    .orderBy('c.date', 'desc')
    .then(result => {
      return result
        .map(r => {
          return merge(r, { count: Number(r.count) });
        })
        .filter(r => r.count > 0);
    });
};

const fetchFriendsCompleted = (userId) => {
  return User.fetchFriends(userId)
    .then(friends => {
      const friendIds = friends.map(friend => friend.id);

      return fetchAllCompleted(friendIds);
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

const fetchStatsPerQuestion = (userId) => {
  return ChecklistScore.fetchStatsPerQuestion(userId);
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

const fetchByDateRange = (startDate, endDate, userId) => {
  const dates = getDatesInRange(startDate, endDate);
  const promises = dates.map(date => findByDate(date, userId));

  return Promise.all(promises);
};

const getAverageScore = (checklists = []) => {
  const scores = checklists
    .filter(c => c && c.isComplete && isNumber(c.points))
    .map(c => c.points);

  return calculateAverage(scores);
};

const fetchWeekStats = (userId) => {
  const today = moment();
  const day = today.day();
  const thisSunday = moment(today).subtract(day === 0 ? 7 : day, 'days');
  const lastSunday = moment(thisSunday).subtract(1, 'week');
  const thisWeek = [thisSunday.format(DATE_FORMAT), today.format(DATE_FORMAT)];
  const lastWeek = [lastSunday.format(DATE_FORMAT), thisSunday.format(DATE_FORMAT)];

  return Promise.all([
    fetchByDateRange(...thisWeek, userId),
    fetchByDateRange(...lastWeek, userId)
  ])
    .then(([thisWeeksChecklists, lastWeeksChecklists]) => {
      const date = moment().format(DATE_FORMAT);
      const todaysChecklist = thisWeeksChecklists.find(s => s.date === date);
      const todaysPoints = todaysChecklist && todaysChecklist.points;

      return {
        today: todaysPoints || null,
        thisWeek: getAverageScore(thisWeeksChecklists),
        lastWeek: getAverageScore(lastWeeksChecklists)
      };
    });
};

const destroy = (id, userId) =>
  findById(id, userId) // FIXME (this does not return a knex object)
    .delete();

module.exports = {
  fetch,
  findById,
  create,
  createWithScores,
  findOrCreateByDate,
  update,
  updateScore,
  updateScores,
  fetchWithPoints,
  fetchCompletedDays,
  fetchFriendsCompleted,
  fetchScoresByDate,
  fetchScoresByDayOfWeek,
  fetchScoresByTask,
  fetchScoreRangeFrequency,
  fetchQuestionStats,
  fetchStatsPerQuestion,
  fetchStats,
  fetchWeekStats,
  destroy
};
