const { AssessmentQuestion } = require('../index');
const { handleError } = require('./utils');
const { isValidDateFormat } = require('../models/utils');

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
    const { user, query } = req;
    const { id: userId } = user;
    const { startDate, endDate } = query;
    const dates = {
      startDate: isValidDateFormat(startDate) ? startDate : -Infinity,
      endDate: isValidDateFormat(endDate) ? endDate : Infinity
    };

    return AssessmentQuestion.fetchStats(userId, dates)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  }
};
