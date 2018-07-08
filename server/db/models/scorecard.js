const knex = require('../knex.js');
const { first, isNumber, max, times } = require('lodash');
const moment = require('moment');
const Task = require('./task');
const ScoreCardSelectedTask = require('./scorecard_selected_task');
const User = require('./user');
const { DATE_FORMAT, calculateAverage } = require('./utils');

const ScoreCard = () => knex('scorecards');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) => {
  return ScoreCard()
    .select()
    .where(merge(where, { userId }));
};

const fetchBetween = (userId, dates = {}) => {
  const {
    startDate = -Infinity,
    endDate = Infinity
  } = dates;

  return ScoreCard()
    .select()
    .whereBetween('date', [startDate, endDate])
    .andWhere({ userId });
};

const findOne = (where, userId) =>
  fetch(where, userId)
    .first();

const fetchTasks = async (scorecardId, userId) => {
  const selectedTasks = await ScoreCardSelectedTask.fetchByScorecardId(scorecardId, userId);
  const selectedTaskIds = selectedTasks.map(({ taskId }) => taskId);
  const tasks = await Task.fetchActive(userId, selectedTaskIds);
  const isComplete = selectedTasks.reduce((map, { taskId }) => {
    return merge(map, { [taskId]: true });
  }, {});

  return tasks.map(t => {
    return merge(t, { isComplete: isComplete[t.id] });
  });
};

// TODO: rename
const findById = async (id, userId, where = {}) => {
  const scorecard = await findOne(merge(where, { id }), userId);
  const tasks = await fetchTasks(id, userId);
  const { date } = scorecard;
  const utc = moment.utc(date).format('YYYY-MM-DD');

  return merge(scorecard, {
    tasks,
    date: utc,
    _date: date
  });
};

const fetchWithPoints = (where = {}, userId) => {
  return Promise.all([
    fetch(where, userId),
    Task.fetch({}, userId)
  ])
    .then(([scorecards, tasks]) => {
      const taskScores = tasks.reduce((map, { id: taskId, points }) => {
        return merge(map, { [taskId]: Number(points) });
      }, {});

      const promises = scorecards.map(scorecard => {
        const { id, date } = scorecard;
        const utc = moment.utc(date).format('YYYY-MM-DD');

        return ScoreCardSelectedTask.fetchByScorecardId(id, userId)
          .then(selectedTasks => {
            const points = selectedTasks.reduce((total, { taskId }) => {
              const score = taskScores[taskId] || 0;

              return isNumber(score) ? total + score : total;
            }, 0);

            return merge(scorecard, { points, date: utc, _date: date });
          });
      });

      return Promise.all(promises);
    });
};

const fetchProgressToday = (where = {}, userId) => {
  return fetchWithPoints(where, userId)
    .then(scorecards => {
      const date = moment().format('YYYY-MM-DD');
      const today = scorecards.find(s => s.date === date);
      const others = scorecards.filter(s => s.date !== date);
      const scores = others.map(s => s.points);
      const average = calculateAverage(scores);
      const top = max(scores);
      const current = (today && today.points) ? today.points : 0;

      return { current, average, top };
    });
};

const fetchCompletedDays = (userId) => {
  return ScoreCard()
    .select('s.date')
    .count('sst.*')
    .from('scorecards as s')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.scorecardId', 's.id')
    .where({ 's.userId': userId })
    .groupBy('s.date')
    .orderBy('s.date', 'desc')
    .then(result => {
      return result
        .map(r => {
          return merge(r, { count: Number(r.count) });
        })
        .filter(r => r.count > 0);
    });
};

const fetchAllCompleted = (userIds = []) => {
  return ScoreCard()
    .select('s.date', 'u.username')
    .count('sst.*')
    .from('scorecards as s')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.scorecardId', 's.id')
    .innerJoin('users as u', 'u.id', 's.userId')
    .whereIn('u.id', userIds)
    .groupBy('s.date', 'u.username')
    .orderBy('s.date', 'desc')
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
  return ScoreCard()
    .select('s.date')
    .sum('t.points as score')
    .count('t.* as completedTasks')
    .from('scorecards as s')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.scorecardId', 's.id')
    .innerJoin('tasks as t', 'sst.taskId', 't.id')
    .where({ 's.userId': userId })
    .groupBy('s.date')
    .orderBy('s.date', 'desc')
    .then(result => {
      return result.map(({ date, completedTasks, score }) => {
        return {
          date,
          completedTasks: Number(completedTasks),
          score: Number(score)
        };
      });
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

const fetchTotalScoreOverTime = (userId) => {
  return fetchScoresByDate(userId)
    .then(result => {
      return result
        .sort((x, y) => Number(new Date(x.date)) - Number(new Date(y.date)))
        .map((r, index, list) => {
          const { date, score, completedTasks } = r;
          const timestamp = Number(new Date(date));
          const past = list.slice(0, index);
          // TODO: this is pretty inefficient
          const totalScore = past.reduce((acc, r) => acc + r.score, score);
          const totalTasks = past.reduce((acc, r) =>
            acc + r.completedTasks, completedTasks);

          return {
            timestamp,
            date,
            score,
            totalScore,
            completedTasks,
            totalTasks
          };
        });
    });
};

const fetchCategoryStats = (userId) => {
  return ScoreCardSelectedTask.fetchSelectedTasksByCategory(userId)
    .then(mappings => {
      return Object.keys(mappings)
        .reduce((result, category) => {
          const tasks = mappings[category];
          const count = tasks.length;
          const score = tasks.reduce((acc, t) => acc + t.points, 0);

          return merge(result, {
            [category]: { count, score }
          });
        }, {});
    });
};

const fetchAbilityStats = (userId) => {
  return ScoreCardSelectedTask.fetchSelectedTasksByAbility(userId)
    .then(mappings => {
      return Object.keys(mappings)
        .reduce((result, category) => {
          const tasks = mappings[category];
          const count = tasks.length;
          const score = tasks.reduce((acc, t) => acc + t.points, 0);

          return merge(result, {
            [category]: { count, score }
          });
        }, {});
    });
};

const fetchStats = (userId) => {
  return Promise.all([
    fetch({}, userId),
    Task.fetch({}, userId)
  ])
    .then(([scorecards, tasks]) => {
      const taskScores = tasks.reduce((map, { id: taskId, points }) => {
        return merge(map, { [taskId]: Number(points) });
      }, {});

      const promises = scorecards.map(scorecard => {
        const { id } = scorecard;

        return ScoreCardSelectedTask.fetchByScorecardId(id, userId)
          .then(selectedTasks => {
            return merge(scorecard, {
              scores: selectedTasks.map(({ taskId }) => {
                return taskScores[taskId] || 0;
              })
            });
          });
      });

      return Promise.all(promises);
    })
    .then(scorecards => {
      const stats = scorecards
        .sort((x, y) => Number(x.date) - Number(y.date))
        .map(scorecard => {
          const { date, scores = [] } = scorecard;
          const timestamp = Number(new Date(date));
          const total = scores.reduce((sum, n) => sum + Number(n), 0);

          return [timestamp, total];
        });

      return stats;
    });
};

const fetchStatsPerCategory = (userId) => {
  return ScoreCardSelectedTask.fetchTaskStatsPerCategory(userId);
};

const create = (params, userId) => {
  return ScoreCard()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));
};

const createWithScores = async (params, userId) => {
  const { date, selectedTasks = [] } = params;
  const scorecard = await create({ date }, userId);
  const { id: scorecardId } = scorecard;
  const promises = selectedTasks.map(({ taskId }) => {
    const selectedTask = { taskId, scorecardId };

    return ScoreCardSelectedTask.create(selectedTask, userId);
  });

  await Promise.all(promises);

  return scorecard;
};

const update = (id, params, userId) => {
  return findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const selectTask = (id, taskId, userId) => {
  const params = { scorecardId: id, taskId, userId };

  return ScoreCardSelectedTask.findOrCreate(params, userId);
};

const deselectTask = (id, taskId, userId) => {
  const params = { scorecardId: id, taskId, userId };

  return ScoreCardSelectedTask.destroyWhere(params, userId);
};

const updateSelectedTasks = (id, params, userId) => {
  const { date, selectedTasks } = params;

  return Promise.all([
    update(id, { date }, userId),
    ScoreCardSelectedTask.destroyByScorecardId(id, userId)
  ])
    .then(([scorecard, removed]) => {
      const promises = selectedTasks.map(selectedTask => {
        const { taskId, scorecardId } = selectedTask;

        return ScoreCardSelectedTask.create({ taskId, scorecardId }, userId);
      });

      return Promise.all(promises);
    });
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

  const scorecard = await findOne(merge(where, { date }), userId);

  if (!scorecard) return null;

  const { id: scorecardId } = scorecard;
  const tasks = await fetchTasks(scorecardId, userId);
  const utc = moment.utc(date).format('YYYY-MM-DD');
  const points = tasks.reduce((total, task) => {
    const { isComplete, points: p } = task;

    return isComplete ? total + p : total;
  }, 0);

  return merge(scorecard, {
    tasks,
    points,
    date: utc,
    _date: date
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

const getAverageScore = (scorecards = []) => {
  const scores = scorecards
    .filter(s => s && isNumber(s.points))
    .map(a => a.points);

  return calculateAverage(scores);
};

const fetchWeekStats = (userId, date = moment().format(DATE_FORMAT)) => {
  console.log('Fetching scorecard week stats for:', moment(date).format(DATE_FORMAT));
  const today = moment(date);
  const day = today.day();
  const thisSunday = moment(today).subtract(day === 0 ? 7 : day, 'days');
  const lastSunday = moment(thisSunday).subtract(1, 'week');
  const thisWeek = [thisSunday.format(DATE_FORMAT), today.format(DATE_FORMAT)];
  const lastWeek = [lastSunday.format(DATE_FORMAT), thisSunday.format(DATE_FORMAT)];

  return Promise.all([
    fetchByDateRange(...thisWeek, userId),
    fetchByDateRange(...lastWeek, userId)
  ])
    .then(([thisWeeksScorecards, lastWeeksScorecards]) => {
      const todaysScorecard = thisWeeksScorecards.find(s => s && s.date === date);
      const todaysPoints = todaysScorecard && todaysScorecard.points;

      return {
        today: todaysPoints || null,
        thisWeek: getAverageScore(thisWeeksScorecards),
        lastWeek: getAverageScore(lastWeeksScorecards)
      };
    });
};

// TODO: DRY up (see `fetchWeekStats` above)
const fetchMonthStats = (userId, date = moment().format(DATE_FORMAT)) => {
  const today = moment(date);
  const current = moment(today).startOf('month');
  const previous = moment(current).subtract(1, 'month');
  const thisMonth = [current.format(DATE_FORMAT), today.format(DATE_FORMAT)];
  const lastMonth = [previous.format(DATE_FORMAT), current.format(DATE_FORMAT)];

  return Promise.all([
    fetchByDateRange(...thisMonth, userId),
    fetchByDateRange(...lastMonth, userId)
  ])
    .then(([thisMonthsScorecards, lastMonthsScorecards]) => {
      const todaysScorecard = thisMonthsScorecards.find(s => s && s.date === date);
      const todaysPoints = todaysScorecard && todaysScorecard.points;

      return {
        today: todaysPoints || null,
        thisMonth: getAverageScore(thisMonthsScorecards),
        lastMonth: getAverageScore(lastMonthsScorecards)
      };
    });
};

const findOrCreateByDate = async (date, userId) => {
  return findOrCreate({ date }, userId)
    .then(scorecard => findByDate(date, userId));
};

const destroy = (id, userId) => {
  return findById(id, userId)
    .delete();
};

module.exports = {
  fetch,
  findById,
  fetchWithPoints,
  fetchProgressToday,
  fetchCompletedDays,
  fetchFriendsCompleted,
  fetchScoresByDate,
  fetchScoresByDayOfWeek,
  fetchTotalScoreOverTime,
  fetchCategoryStats,
  fetchAbilityStats,
  fetchStats,
  fetchStatsPerCategory,
  create,
  createWithScores,
  update,
  selectTask,
  deselectTask,
  updateSelectedTasks,
  fetchWeekStats,
  fetchMonthStats,
  findOrCreateByDate,
  destroy
};
