const { first } = require('lodash');
const moment = require('moment');
const knex = require('../knex');

const formatWithUtc = (record = {}) => {
  if (!record || !record.date) return record;

  const { date } = record;
  const utc = moment.utc(date).format('YYYY-MM-DD');

  return {
    ...record,
    date: utc,
    _date: date
  };
};

const UserMood = () => knex('user_moods');

const fetch = (where = {}, userId) => {
  return UserMood()
    .select()
    .where({ ...where, userId });
};

const findOne = (where = {}, userId) => {
  return fetch(where, userId).first();
};

const findById = (id, userId, where = {}) => {
  return findOne({ ...where, id }, userId);
};

const findByDate = (date, userId) => {
  return UserMood()
    .select('m.description', 'm.code', 'um.*')
    .from('user_moods as um')
    .innerJoin('moods as m', 'um.moodId', 'm.id')
    .where({ 'um.userId': userId, 'um.date': date })
    .then(first)
    .then(result => {
      if (!result) return null;

      return formatWithUtc(result);
    });
};

const fetchByUser = (userId) => {
  return UserMood()
    .select('m.description', 'm.code', 'um.*')
    .from('user_moods as um')
    .innerJoin('moods as m', 'um.moodId', 'm.id')
    .where({ 'um.userId': userId })
    .then(results => results.map(formatWithUtc));
};

const create = (params, userId) => {
  return UserMood()
    .returning('id')
    .insert({ ...params, userId })
    .then(first)
    .then(id => findById(id, userId));
};

const update = (id, params, userId) => {
  return findById(id, userId)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id, userId));
};

const createOrUpdate = (date, moodId, userId) => {
  return findByDate(date, userId)
    .then(result => {
      const id = result && result.id;
      const params = { date, moodId, userId };

      if (id) {
        return update(id, params, userId);
      } else {
        return create(params, userId);
      }
    })
    .then(() => findByDate(date, userId));
};

const destroy = (id, userId) => {
  return findById(id, userId).delete();
};

module.exports = {
  fetch,
  findById,
  findByDate,
  fetchByUser,
  create,
  update,
  createOrUpdate,
  destroy
};
