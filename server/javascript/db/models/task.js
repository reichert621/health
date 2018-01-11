const knex = require('../knex.js');
const { first } = require('lodash');

const Tasks = () => knex('tasks');

const merge = (x, y) => Object.assign({}, x, y);

// TODO: clean this up or rename
const fetch = (where = {}, userId) =>
  Tasks()
    .select('tasks.*', 'categories.name as category')
    .innerJoin('categories', 'tasks.categoryId', 'categories.id')
    .where(merge(where, { 'tasks.userId': userId }))
    .orderBy('tasks.id', 'asc');

const fetchTopSelected = (userId) => {
  return Tasks()
    .select('tasks.description', 'tasks.points', 'categories.name as category')
    .innerJoin(
      'scorecard_selected_tasks',
      'scorecard_selected_tasks.taskId',
      'tasks.id'
    )
    .innerJoin('categories', 'tasks.categoryId', 'categories.id')
    .where({ 'scorecard_selected_tasks.userId': userId })
    .then(results => {
      return results
        .reduce((stats, { category, description, points }) => {
          const key = `${category}: ${description}`;
          const [count] = stats[key] || [0];

          return Object.assign(stats, {
            [key]: [count + 1, points] // store points as well for reference
          });
        }, {});
    })
    .then(mapped => {
      return Object.keys(mapped)
        .map(task => {
          const [count, points] = mapped[task];

          return { task, count, points };
        })
        .sort((x, y) => {
          // Sort by count, taking points into account if counts are the same
          return (y.count + (y.points / 10)) - (x.count + (x.points / 10));
        });
    });
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

const update = (id, userId, params = {}) =>
  findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroy = (id, userId) =>
  findById(id, userId).delete();

module.exports = {
  fetch,
  fetchTopSelected,
  findById,
  create,
  update,
  destroy
};
