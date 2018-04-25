const knex = require('../knex.js');
const moment = require('moment');
const { first } = require('lodash');

const Entries = () => knex('entries');

const merge = (x, y) => Object.assign({}, x, y);

const formatWithUtc = (entry = {}) => {
  const { date } = entry;
  const utc = moment.utc(date).format('YYYY-MM-DD');

  return merge(entry, {
    date: utc,
    _date: date
  });
};

const fetch = (where = {}, userId) =>
  Entries()
    .select()
    .where(merge(where, { userId }));

// TODO: deprecate `fetch` in favor of this function if possible
const fetchWithUtc = (where = {}, userId) => {
  return fetch(where, userId)
    .then(entries => entries.map(formatWithUtc));
};

const findOne = (where = {}, userId) =>
  fetch(where, userId)
    .first();

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { id }), userId)
    .then(entry => {
      if (!entry) throw new Error('No entry found!');

      return formatWithUtc(entry);
    });

const findByDate = (date, userId, where = {}) => {
  return findOne(merge(where, { date }), userId)
    .then(entry => {
      if (!entry) throw new Error('No entry found!');

      return formatWithUtc(entry);
    });
};

const create = (params, userId) =>
  Entries()
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

const findOrCreateByDate = async (date, userId) => {
  return findOrCreate({ date }, userId)
    .then(entry => findByDate(date, userId));
};

const update = (id, params, userId) =>
  findOne({ id }, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));

const destroy = (id, userId) =>
  findOne({ id }, userId)
    .delete();

module.exports = {
  fetch,
  fetchWithUtc,
  findById,
  create,
  findOrCreateByDate,
  update,
  destroy
};
