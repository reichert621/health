const knex = require('../knex.js');
const { first, groupBy, isNumber, sum } = require('lodash');
const moment = require('moment');
const Task = require('./task');
const ScoreCardSelectedTask = require('./scorecard_selected_task');

const ScoreCard = () => knex('scorecards');

const merge = (x, y) => Object.assign({}, x, y);

const fetch = (where = {}, userId) =>
  ScoreCard()
    .select()
    .where(merge(where, { userId }));

const findOne = (where, userId) =>
  fetch(where, userId)
    .first();

// TODO: rename
const findById = (id, userId, where = {}) => {
  return Promise.all([
    findOne(merge(where, { id }), userId),
    ScoreCardSelectedTask.fetchByScorecardId(id, userId),
    Task.fetch({}, userId)
  ])
    .then(([scorecard, selectedTasks, tasks]) => {
      const { date } = scorecard;
      const utc = moment.utc(date).format('YYYY-MM-DD');
      const isComplete = selectedTasks.reduce((map, { taskId }) => {
        return merge(map, { [taskId]: true });
      }, {});

      return merge(scorecard, {
        date: utc,
        _date: date,
        tasks: tasks.map(t => {
          return merge(t, { isComplete: isComplete[t.id] });
        })
      });
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

const fetchScoresByDate = (userId) => {
  return ScoreCard()
    .select('s.date')
    .sum('t.points as score')
    .from('scorecards as s')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.scorecardId', 's.id')
    .innerJoin('tasks as t', 'sst.taskId', 't.id')
    .where({ 's.userId': userId })
    .groupBy('s.date')
    .orderBy('s.date', 'desc')
    .then(result => {
      return result.map(({ date, score }) => {
        return { date, score: Number(score) };
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
        .map(({ date, score }, index, list) => {
          const timestamp = Number(new Date(date));
          const past = list.slice(0, index);
          // TODO: this is pretty inefficient
          const total = past.reduce((acc, r) => acc + r.score, score);

          return { timestamp, date, score, total };
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
          const score = tasks.reduce((sum, t) => sum + t.points, 0);

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

const create = (params, userId) => {
  console.log('Creating scorecard!', params, userId);
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

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

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

const destroy = (id, userId) =>
  findById(id, userId)
    .delete();

module.exports = {
  fetch,
  findById,
  fetchWithPoints,
  fetchCompletedDays,
  fetchScoresByDate,
  fetchScoresByDayOfWeek,
  fetchTotalScoreOverTime,
  fetchCategoryStats,
  fetchStats,
  create,
  createWithScores,
  update,
  selectTask,
  deselectTask,
  updateSelectedTasks,
  destroy
};
