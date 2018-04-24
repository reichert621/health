const { reject } = require('bluebird');
const { first } = require('lodash');
const knex = require('../knex');

// TODO: DRY up all these model classes!
class BaseModel {
  constructor(table) {
    this.Model = () => knex(table);
  }

  fetch(where = {}) {
    return this.Model()
      .select()
      .where(where);
  }

  findOne(where = {}) {
    return this.fetch(where).first();
  }

  findById(id, where = {}) {
    return this.findOne({ ...where, id });
  }

  create(params = {}) {
    return this.Model()
      .returning('id')
      .insert(params)
      .then(first)
      .then(id => this.findById(id));
  }

  update(id, updates = {}) {
    return this.findById(id)
      .update(updates)
      .then(count => (count > 0))
      .then(success => this.findById(id));
  }

  destroy(id) {
    return this.findById(id).delete();
  }
}

// TODO: figure out the best way to handle this
class SecureModel extends BaseModel {
  fetch(where = {}, userId) {
    if (!userId) reject(new Error('User id is required!'));

    return this.Model()
      .select()
      .where({ ...where, userId });
  }

  findOne(where = {}, userId) {
    if (!userId) reject(new Error('User id is required!'));

    return this.fetch(where, userId).first();
  }

  findById(id, userId, where = {}) {
    if (!userId) reject(new Error('User id is required!'));

    return this.findOne({ ...where, id, userId });
  }

  create(params = {}, userId) {
    if (!userId) reject(new Error('User id is required!'));

    return this.Model()
      .returning('id')
      .insert({ ...params, userId })
      .then(first)
      .then(id => this.findById(id, userId));
  }

  update(id, updates = {}, userId) {
    if (!userId) reject(new Error('User id is required!'));

    return this.findById(id, userId)
      .update(updates)
      .then(count => (count > 0))
      .then(success => this.findById(id, userId));
  }

  destroy(id, userId) {
    if (!userId) reject(new Error('User id is required!'));

    return this.findById(id, userId).delete();
  }
}

const fetch = (model, where = {}) => {
  return model()
    .select()
    .where(where);
};

const findOne = (model, where = {}) => {
  return fetch(model, where).first();
};

const findById = (model, id, where = {}) => {
  if (!id) return reject(new Error('An id is required!'));

  return findOne(model, { ...where, id });
};

const create = (model, params = {}) => {
  return model()
    .returning('id')
    .insert(params)
    .then(first)
    .then(id => findById(model, id));
};

const update = (model, id, updates = {}) => {
  if (!id) return reject(new Error('An id is required!'));

  return findById(model, id)
    .update(updates)
    .then(count => (count > 0))
    .then(success => findById(model, id));
};

const destroy = (model, id) => {
  if (!id) return reject(new Error('An id is required!'));

  return findById(model, id).delete();
};

const wrapper = (table) => {
  const Model = () => knex(table);

  return {
    fetch: (where = {}) => fetch(Model, where),
    findOne: (where = {}) => findOne(Model, where),
    findById: (id, where = {}) => findById(Model, id, where),
    create: (params = {}) => create(Model, params),
    update: (id, updates = {}) => update(Model, id, updates),
    destroy: (id) => destroy(Model, id)
  };
};

module.exports = {
  BaseModel,
  SecureModel,
  wrapper
};
