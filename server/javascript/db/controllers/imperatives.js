const { Imperative } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) =>
    Imperative.fetch({}, req.user.id)
      .then(imperatives => res.json({ imperatives }))
      .catch(err => handleError(res, err)),

  findById: (req, res) =>
    Imperative.findById(req.params.id, req.user.id)
      .then(imperative => res.json({ imperative }))
      .catch(err => handleError(res, err)),

  create: (req, res) =>
    Imperative.create(req.body, req.user.id)
      .then(imperative => res.json({ imperative }))
      .catch(err => handleError(res, err)),

  update: (req, res) =>
    Imperative.update(req.params.id, req.body, req.user.id)
      .then(imperative => res.json({ imperative }))
      .catch(err => handleError(res, err)),

  destroy: (req, res) =>
    Imperative.destroy(req.params.id, req.user.id)
      .then(imperative => res.json({ imperative }))
      .catch(err => handleError(res, err))
};
