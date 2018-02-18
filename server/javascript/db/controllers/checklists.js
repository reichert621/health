const { Checklist } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) => {
    return Checklist.fetchWithPoints({}, req.user.id)
      .then(checklists => res.json({ checklists }))
      .catch(err => handleError(res, err));
  },

  create: (req, res) => {
    return Checklist.createWithScores(req.body, req.user.id)
      .then(checklist => res.json({ checklist }))
      .catch(err => handleError(res, err));
  },

  findById: (req, res) => {
    return Checklist.findById(req.params.id, req.user.id)
      .then(checklist => res.json({ checklist }))
      .catch(err => handleError(res, err));
  },

  updateScores: (req, res) => {
    return Checklist.updateScores(req.params.id, req.body, req.user.id)
      .then(updates => res.json({ updates }))
      .catch(err => handleError(res, err));
  },

  fetchStats: (req, res) => {
    return Checklist.fetchStats(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchCompletedDays: (req, res) => {
    return Checklist.fetchCompletedDays(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchScoresByDayOfWeek: (req, res) => {
    return Checklist.fetchScoresByDayOfWeek(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchScoreRangeFrequency: (req, res) => {
    return Checklist.fetchScoreRangeFrequency(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchQuestionStats: (req, res) => {
    return Checklist.fetchQuestionStats(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchScoresByTask: (req, res) => {
    return Checklist.fetchScoresByTask(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  }
};
