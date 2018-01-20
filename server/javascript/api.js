const express = require('express');
const { auth, isAuthenticated } = require('./passport');

const { Router } = express;
const {
  users,
  entries,
  scorecards,
  categories,
  checklists,
  checklistQuestions,
  checklistScores,
  reporting,
  tasks
} = require('./db/controllers');

const api = Router();

const logout = (req, res) => {
  req.logout();

  return res
    .status(200)
    .send({ status: 200 });
};

// For testing
const pong = (req, res) =>
  res.json({ message: 'pong' });

api.get('/ping', pong);
// Auth
api.post('/signup', users.signup);
api.post('/login', auth, users.login);
api.all('/logout', logout);
// Entries
api.get('/entries', isAuthenticated, entries.fetch);
api.get('/entries/:id', isAuthenticated, entries.findById);
api.post('/entries', isAuthenticated, entries.create);
api.put('/entries/:id', isAuthenticated, entries.update);
api.delete('/entries/:id', isAuthenticated, entries.destroy);
// Users
api.get('/is-authenticated', users.isAuthenticated);
api.get('/users/:username/entries', users.fetchEntries);
api.get('/users/:username/entries/:id', users.fetchEntry);
// Scorecards
api.get('/scorecards', isAuthenticated, scorecards.fetch);
api.get('/scorecards/:id', isAuthenticated, scorecards.findById);
api.post('/scorecards/new', isAuthenticated, scorecards.create);
api.put('/scorecards/:id', isAuthenticated, scorecards.update);
api.post('/scorecards/:id/select-task/:taskId', isAuthenticated, scorecards.selectTask);
api.delete('/scorecards/:id/deselect-task/:taskId', isAuthenticated, scorecards.deselectTask);
// Categories
api.get('/categories', isAuthenticated, categories.fetch);
api.post('/categories', isAuthenticated, categories.create);
// Tasks
api.get('/tasks', isAuthenticated, tasks.fetch);
api.post('/tasks', isAuthenticated, tasks.create);
api.put('/tasks/:id', isAuthenticated, tasks.update);
// Checklists
api.get('/checklists', isAuthenticated, checklists.fetch);
api.get('/checklists/:id', isAuthenticated, checklists.findById);
api.post('/checklists/:id/update-scores', isAuthenticated, checklists.updateScores);
api.post('/checklists/new', isAuthenticated, checklists.create);
// Checklist Scores
api.get('/checklist-scores', isAuthenticated, checklistScores.fetch);
// Checklist Questions
api.get('/checklist-questions', checklistQuestions.fetch);
// Reporting Stats
// TODO: clean up these endpoints
api.get('/stats/all', isAuthenticated, reporting.fetchAllStats);
api.get('/stats/checklists', isAuthenticated, checklists.fetchStats);
api.get('/stats/scorecards', isAuthenticated, scorecards.fetchStats);
api.get('/stats/top-tasks', isAuthenticated, tasks.fetchTopSelected);
api.get('/stats/completed-checklists', isAuthenticated, checklists.fetchCompletedDays);
api.get('/stats/completed-scorecards', isAuthenticated, scorecards.fetchCompletedDays);
api.get('/stats/checklist-scores-by-day', isAuthenticated, checklists.fetchScoresByDayOfWeek);
api.get('/stats/scorecard-scores-by-day', isAuthenticated, scorecards.fetchScoresByDayOfWeek);
api.get('/stats/depression-level-frequency', isAuthenticated, checklists.fetchScoreRangeFrequency);
api.get('/stats/total-score-over-time', isAuthenticated, scorecards.fetchTotalScoreOverTime);
api.get('/stats/checklist-questions', isAuthenticated, checklists.fetchQuestionStats);
api.get('/stats/task-category-totals', isAuthenticated, scorecards.fetchCategoryStats);

module.exports = api;
