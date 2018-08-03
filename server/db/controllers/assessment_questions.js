const { AssessmentQuestion } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetchStatsById: (req, res) => {
    const { params, user } = req;
    const { id: questionId } = params;
    const { id: userId } = user;

    return AssessmentQuestion.fetchStatsById(questionId, userId)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchStats: (req, res) => {
    const { id: userId } = req.user;

    return AssessmentQuestion.fetchStats(userId)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  }
};
