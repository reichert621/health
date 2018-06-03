const { Assessment } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) => {
    return Assessment.fetch()
      .then(assessments => res.json({ assessments }))
      .catch(err => handleError(res, err));
  },

  depression: (req, res) => {
    return Assessment.fetchDepressionQuestions()
      .then(questions => res.json({ questions }))
      .catch(err => handleError(res, err));
  },

  anxiety: (req, res) => {
    return Assessment.fetchAnxietyQuestions()
      .then(questions => res.json({ questions }))
      .catch(err => handleError(res, err));
  },

  wellBeing: (req, res) => {
    return Assessment.fetchWellBeingQuestions()
      .then(questions => res.json({ questions }))
      .catch(err => handleError(res, err));
  }
};
