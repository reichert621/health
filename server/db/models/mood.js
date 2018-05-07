const { first } = require('lodash');
const knex = require('../knex');
const UserMood = require('./user_mood');

const Mood = () => knex('moods');

const fetch = (where = {}) => {
  return Mood()
    .select()
    .where(where);
};

const findOne = (where = {}) => {
  return fetch(where).first();
};

const findById = (id, where = {}) => {
  return findOne({ ...where, id });
};

const findByDate = (date, userId) => {
  return UserMood.findByDate(date, userId);
};

const fetchByUser = (userId) => {
  return UserMood.fetchByUser(userId);
};

const create = (params) => {
  return Mood()
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

const setByDate = (date, moodId, userId) => {
  return UserMood.createOrUpdate(date, moodId, userId);
};

const destroy = (id) => {
  return findById(id).delete();
};

module.exports = {
  fetch,
  findById,
  findByDate,
  fetchByUser,
  create,
  update,
  setByDate,
  destroy
};
