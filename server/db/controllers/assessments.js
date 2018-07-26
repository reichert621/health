const { Assessment } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) => {
    const { id: userId } = req.user;

    return Assessment.fetchUserAssessments(userId)
      .then(assessments => res.json({ assessments }))
      .catch(err => handleError(res, err));
  },

  findOrCreate: (req, res) => {
    const { body, user } = req;
    const { type, date } = body;
    const { id: userId } = user;

    return Assessment.findOrCreateUserAssessment(type, date, userId)
      .then(assessment => res.json({ assessment }))
      .catch(err => handleError(res, err));
  },

  fetchByDate: (req, res) => {
    const { params, user } = req;
    const { date } = params;
    const { id: userId } = user;

    return Assessment.fetchUserAssessmentsByDate(date, userId)
      .then(assessments => res.json({ assessments }))
      .catch(err => handleError(res, err));
  },

  fetchStats: (req, res) => {
    const { id: userId } = req.user;

    return Assessment.fetchStats(userId)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchStatsPerQuestion: (req, res) => {
    const { id: userId } = req.user;

    return Assessment.fetchStatsPerQuestion(userId)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  findById: (req, res) => {
    const { params, user } = req;
    const { id: userAssessmentId } = params;
    const { id: userId } = user;

    return Assessment.fetchUserAssessmentById(userAssessmentId, userId)
      .then(assessment => res.json({ assessment }))
      .catch(err => handleError(res, err));
  },

  updateScore: (req, res) => {
    const { params, user, body } = req;
    const { id, questionId } = params;
    const { score } = body;
    const { id: userId } = user;

    return Assessment.updateScore(id, questionId, score, userId)
      .then(assessmentScore => res.json({ assessmentScore }))
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
