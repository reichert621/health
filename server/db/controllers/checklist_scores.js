const { ChecklistScore } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) =>
    ChecklistScore.fetch({}, req.user.id)
      .then(scores => res.json({ scores }))
      .catch(err => handleError(res, err))
};
