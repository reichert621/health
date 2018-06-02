const { first } = require('lodash');
const knex = require('../knex');

const types = {
  DEPRESSION: 'depression',
  ANXIETY: 'anxiety',
  WELL_BEING: 'wellbeing'
};

const AssessmentQuestion = () => knex('assessment_questions');

const fetch = (where = {}) => {
  return AssessmentQuestion()
    .select()
    .where(where);
};

const findOne = (where = {}) => {
  return fetch(where).first();
};

const findById = (id, where = {}) => {
  return findOne({ ...where, id });
};

const create = (params) => {
  return AssessmentQuestion()
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

module.exports = {
  types,
  fetch,
  findById,
  create,
  update,
  destroy
};
