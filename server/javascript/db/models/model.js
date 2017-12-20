const knex = require('../knex.js');
const { first } = require('lodash');

const merge = (x, y) => Object.assign({}, x, y);

// TODO: don't use class syntax, just export functions
// TODO: DRY up all these model classes!
class BaseModel {
  constructor(table) {
    this.model = knex(table);
  }

  fetch(where = {}) {
    return this.model
      .select()
      .where(where);
  }

  findOne(where = {}) {
    return this.fetch(where).first();
  }

  findById(id, where = {}) {
    return this.findOne(merge(where, { id }));
  }

  create(params = {}) {
    return this.model
      .returning('id')
      .insert(params)
      .then(first)
      .then(id => this.findById(id));
  }

  update(id, params) {
    return this.findById(id)
      .update(params)
      .then(count => (count > 0))
      .then(success => this.findById(id));
  }

  destroy(id) {
    return this.findById(id).delete();
  }
}

module.exports = BaseModel;
