const { Category } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) => {
    return Category.fetch({}, req.user.id)
      .then(categories => res.json({ categories }))
      .catch(err => handleError(res, err));
  },

  create: (req, res) => {
    // findOrCreate to avoid duplicates
    return Category.findOrCreate(req.body, req.user.id)
      .then(category => res.json({ category }))
      .catch(err => handleError(res, err));
  }
};
