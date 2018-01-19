const { ScoreCard } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) => {
    return ScoreCard.fetchWithPoints({}, req.user.id)
      .then(scorecards => res.json({ scorecards }))
      .catch(err => handleError(res, err));
  },

  findById: (req, res) => {
    return ScoreCard.findById(req.params.id, req.user.id)
      .then(scorecard => res.json({ scorecard }))
      .catch(err => handleError(res, err));
  },

  create: (req, res) => {
    return ScoreCard.createWithScores(req.body, req.user.id)
      .then(scorecard => res.json({ scorecard }))
      .catch(err => handleError(res, err));
  },

  selectTask: (req, res) => {
    const { id, taskId } = req.params;

    return ScoreCard.selectTask(id, taskId, req.user.id)
      .then(selectedTask => res.json({ success: !!selectedTask }))
      .catch(err => handleError(res, err));
  },

  deselectTask: (req, res) => {
    const { id, taskId } = req.params;

    return ScoreCard.deselectTask(id, taskId, req.user.id)
      .then(removed => res.json({ success: removed > 0 }))
      .catch(err => handleError(res, err));
  },

  update: (req, res) => {
    return ScoreCard.update(req.params.id, req.body, req.user.id)
      .then(scorecard => res.json({ scorecard }))
      .catch(err => handleError(res, err));
  },

  updateSelectedTasks: (req, res) => {
    return ScoreCard.updateSelectedTasks(req.params.id, req.body, req.user.id)
      .then(updates => res.json({ updates }))
      .catch(err => handleError(res, err));
  },

  fetchStats: (req, res) => {
    return ScoreCard.fetchStats(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchCompletedDays: (req, res) => {
    return ScoreCard.fetchCompletedDays(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchScoresByDayOfWeek: (req, res) => {
    return ScoreCard.fetchScoresByDayOfWeek(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchCategoryStats: (req, res) => {
    return ScoreCard.fetchCategoryStats(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  },

  fetchTotalScoreOverTime: (req, res) => {
    return ScoreCard.fetchTotalScoreOverTime(req.user.id)
      .then(stats => res.json({ stats }))
      .catch(err => handleError(res, err));
  }
};
