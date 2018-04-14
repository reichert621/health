const { ChecklistQuestion } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) =>
    ChecklistQuestion.fetch()
      .then(questions => res.json({ questions }))
      .catch(err => handleError(res, err))
};
