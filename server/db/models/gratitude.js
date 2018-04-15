const { first } = require('lodash');
const moment = require('moment');
const knex = require('../knex.js');

const Gratitudes = () => knex('gratitudes');

const merge = (x, y) => Object.assign({}, x, y);

const formatWithUtc = (record = {}) => {
  const { date } = record;
  const utc = moment.utc(date).format('YYYY-MM-DD');

  return merge(record, {
    date: utc,
    _date: date
  });
};

const fetch = (where = {}, userId) =>
  Gratitudes()
    .select()
    .where(merge(where, { userId }));

// TODO: deprecate `fetch` in favor of this function if possible
const fetchWithUtc = (where = {}, userId) => {
  return fetch(where, userId)
    .then(gratitudes => gratitudes.map(formatWithUtc));
};

const findOne = (where = {}, userId) =>
  fetch(where, userId).first();

const findById = (id, userId, where = {}) =>
  findOne(merge(where, { id }), userId);

const create = (params = {}, userId) =>
  Gratitudes()
    .returning('id')
    .insert(merge(params, { userId }))
    .then(first)
    .then(id => findById(id, userId));

const update = (id, params = {}, userId) => {
  return findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const destroy = (id, userId) =>
  findById(id, userId).delete();

module.exports = {
  fetch,
  fetchWithUtc,
  findById,
  create,
  update,
  destroy
};
