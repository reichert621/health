const { Gratitude } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) =>
    Gratitude.fetch({}, req.user.id)
      .then(gratitudes => res.json({ gratitudes }))
      .catch(err => handleError(res, err)),

  findById: (req, res) =>
    Gratitude.findById(req.params.id, req.user.id)
      .then(gratitude => res.json({ gratitude }))
      .catch(err => handleError(res, err)),

  create: (req, res) =>
    Gratitude.create(req.body, req.user.id)
      .then(gratitude => res.json({ gratitude }))
      .catch(err => handleError(res, err)),

  update: (req, res) =>
    Gratitude.update(req.params.id, req.body, req.user.id)
      .then(gratitude => res.json({ gratitude }))
      .catch(err => handleError(res, err)),

  destroy: (req, res) =>
    Gratitude.destroy(req.params.id, req.user.id)
      .then(gratitude => res.json({ gratitude }))
      .catch(err => handleError(res, err))
};
