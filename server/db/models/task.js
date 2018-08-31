const { first, groupBy, mapValues } = require('lodash');
const knex = require('../knex.js');
const DefaultTasks = require('./default_tasks');
const Categories = require('./category');
const UserAssessments = require('./user_assessment');
const {
  includesDateInDates,
  formatBetweenFilter,
  calculateAverage
} = require('./utils');

const Tasks = () => knex('tasks');

const merge = (x, y) => Object.assign({}, x, y);

const isValidPointValue = (points) => {
  return [-4, -1, 1, 2, 4, 8, 16, 24].includes(points);
};

// TODO: clean this up or rename to `fetchWithCategory`
const fetch = (where = {}, userId) =>
  Tasks()
    .select('tasks.*', 'categories.name as category')
    .innerJoin('categories', 'tasks.categoryId', 'categories.id')
    .where(merge(where, { 'tasks.userId': userId }))
    .orderBy('tasks.id', 'asc');

const fetchActive = (userId, taskIds = []) =>
  fetch({ 'tasks.isActive': true }, userId)
    .orWhereIn('tasks.id', taskIds);

const fetchTopSelected = (userId, dates = {}) => {
  return Tasks()
    .select(
      't.id as taskId',
      't.description',
      't.points',
      't.isActive',
      'c.name as category',
      's.date'
    )
    .from('tasks as t')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.taskId', 't.id')
    .innerJoin('scorecards as s', 'sst.scorecardId', 's.id')
    .innerJoin('categories as c', 't.categoryId', 'c.id')
    .where({ 'sst.userId': userId })
    .andWhere(k => k.whereBetween('s.date', formatBetweenFilter(dates)))
    .then(results => {
      return results
        .reduce((stats, result) => {
          const { category, description } = result;
          const key = `${category}: ${description}`;
          const { count = 0 } = stats[key] || {};

          return Object.assign(stats, {
            [key]: { ...result, count: count + 1 }
          });
        }, {});
    })
    .then(mapped => {
      return Object.keys(mapped)
        .map(task => {
          return { ...mapped[task], task };
        })
        .sort((x, y) => {
          // Sort by count, taking points into account if counts are the same
          return (y.count + (y.points / 10)) - (x.count + (x.points / 10));
        });
    });
};

const fetchSuggestions = (userId) => {
  return fetchTopSelected(userId)
    .then(results => {
      const valid = results.filter(r => r.isActive);
      const count = valid.length;
      const simple = valid.filter(r => r.points < 2).slice(0, 5);

      if (count <= 5) {
        return {
          favorites: valid,
          simple: [],
          neglected: []
        };
      }

      const n = (count < 10) ? Math.floor(valid.length / 2) : 5;

      return {
        simple,
        favorites: valid.slice(0, n),
        neglected: valid.slice(-n)
      };
    });
};

const fetchDefaults = () => {
  return DefaultTasks.getDefaults();
};

const findOne = (where = {}, userId) =>
  fetch(where, userId).first();

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { 'tasks.id': id }), userId);

const create = (params = {}, userId) =>
  Tasks()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const findOrCreate = (params, userId) => {
  return findOne(params, userId)
    .then(found => {
      if (found) {
        return found;
      }

      return create(params, userId);
    });
};

const createSuggestedTask = (suggestion = {}, userId) => {
  const { category, description, points } = suggestion;

  if (!category) return Promise.reject(new Error('A category is required!'));
  if (!description) return Promise.reject(new Error('A description is required!'));
  if (!points) return Promise.reject(new Error('Points are required!'));

  return Categories.findOrCreate({ name: category, isActive: true }, userId)
    .then(({ id: categoryId }) => {
      const task = {
        description,
        points,
        categoryId,
        isActive: true
      };

      return create(task, userId);
    });
};


const update = (id, userId, params = {}) => {
  // TODO: should validations be handled somewhere else?
  const { points } = params;

  if (points && !isValidPointValue(points)) {
    return Promise.reject(new Error(`Invalid point value: ${points}`));
  }

  return findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const destroy = (id, userId) => {
  return findById(id, userId).delete();
};

// TODO: maybe this logic should be in an assessment model?
const generateAssessmentStatsByDates = (assessmentsByType, dates = []) => {
  return mapValues(assessmentsByType, items => {
    const included = items.filter(a => includesDateInDates(a.date, dates));
    const excluded = items.filter(a => !includesDateInDates(a.date, dates));
    const result = {
      included: calculateAverage(included.map(a => Number(a.score))),
      excluded: calculateAverage(excluded.map(a => Number(a.score)))
    };

    return {
      ...result,
      delta: result.included - result.excluded
    };
  });
};

const fetchDatesByTask = (userId, dates = {}) => {
  return Tasks()
    .select('t.id', 't.description', 't.points', 's.date', 'c.name as category')
    .from('tasks as t')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.taskId', 't.id')
    .innerJoin('scorecards as s', 'sst.scorecardId', 's.id')
    .innerJoin('categories as c', 't.categoryId', 'c.id')
    .where({ 'sst.userId': userId })
    .andWhere(k => k.whereBetween('s.date', formatBetweenFilter(dates)))
    .then(results => {
      return results.reduce((acc, r) => {
        const { id, description, points, category, date } = r;
        const { task = {}, dates = [] } = acc[id] || {};

        return {
          ...acc,
          [id]: {
            task: {
              ...task, id, description, points, category
            },
            dates: dates.concat(date)
          }
        };
      }, {});
    })
    .then(mapped => Object.values(mapped));
};

const fetchStats = async (userId, dates = {}) => {
  const datesByTask = await fetchDatesByTask(userId, dates);
  const assessments = await UserAssessments.fetchWithScores(userId);
  const grouped = groupBy(assessments, 'type');

  return datesByTask.map(({ task, dates: ds = [] }) => {
    return {
      task,
      count: ds.length,
      stats: generateAssessmentStatsByDates(grouped, ds)
    };
  });
};

const fetchDatesAccomplished = (id, userId, dates = {}) => {
  return Tasks()
    .select('t.id', 't.description', 't.points', 's.date', 'c.name as category')
    .from('tasks as t')
    .innerJoin('scorecard_selected_tasks as sst', 'sst.taskId', 't.id')
    .innerJoin('scorecards as s', 'sst.scorecardId', 's.id')
    .innerJoin('categories as c', 't.categoryId', 'c.id')
    .where({ 'sst.userId': userId, 't.id': id })
    .andWhere(k => k.whereBetween('s.date', formatBetweenFilter(dates)))
    .then(results => {
      const [{ description, points, category }] = results;

      return {
        task: { id, description, points, category },
        dates: results.map(r => r.date)
      };
    });
};

const fetchStatsById = async (id, userId) => {
  const { task, dates = [] } = await fetchDatesAccomplished(id, userId);
  const assessments = await UserAssessments.fetchWithScores(userId);
  const grouped = groupBy(assessments, 'type');

  return {
    task,
    count: dates.length,
    stats: generateAssessmentStatsByDates(grouped, dates)
  };
};

module.exports = {
  fetch,
  fetchActive,
  fetchTopSelected,
  fetchSuggestions,
  fetchDefaults,
  findById,
  create,
  findOrCreate,
  createSuggestedTask,
  update,
  destroy,
  fetchStats,
  fetchStatsById
};
