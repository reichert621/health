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
  imperatives,
  gratitudes,
  reporting,
  tasks,
  challenges,
  moods,
  assessments
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
api.post('/entries/date', isAuthenticated, entries.findOrCreateByDate); // TODO: name better
api.post('/entries', isAuthenticated, entries.create);
api.put('/entries/:id', isAuthenticated, entries.update);
api.delete('/entries/:id', isAuthenticated, entries.destroy);
// Users
api.get('/is-authenticated', users.isAuthenticated);
api.get('/users/:username/entries', users.fetchEntries);
api.get('/users/:username/entries/:id', users.fetchEntry);
// Feed
api.get('/feed', isAuthenticated, users.feed);
// Scorecards
api.get('/scorecards', isAuthenticated, scorecards.fetch);
api.get('/scorecards/progress-today', isAuthenticated, scorecards.fetchProgressToday);
api.get('/scorecards/:id', isAuthenticated, scorecards.findById);
api.post('/scorecards/date', isAuthenticated, scorecards.findOrCreateByDate); // TODO: name better
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
api.get('/tasks/suggestions', isAuthenticated, tasks.fetchSuggestions);
api.get('/tasks/defaults', tasks.fetchDefaults);
api.post('/tasks/suggestions', isAuthenticated, tasks.createSuggestedTask);
// Assessments
api.get('/assessments', isAuthenticated, assessments.fetch);
api.get('/assessments/:id', isAuthenticated, assessments.findById);
api.get('/assessments/date/:date', isAuthenticated, assessments.fetchByDate);
api.post('/assessments', isAuthenticated, assessments.findOrCreate);
api.post('/assessments/:id/questions/:questionId/score', isAuthenticated, assessments.updateScore);
api.get('/assessments/depression', assessments.depression);
api.get('/assessments/anxiety', assessments.anxiety);
api.get('/assessments/well-being', assessments.wellBeing);
// Checklists
api.get('/checklists', isAuthenticated, checklists.fetch);
api.get('/checklists/:id', isAuthenticated, checklists.findById);
api.post('/checklists/date', isAuthenticated, checklists.findOrCreateByDate); // TODO: name better
api.post('/checklists/:id/questions/:questionId/score', isAuthenticated, checklists.updateScore);
api.post('/checklists/:id/update-scores', isAuthenticated, checklists.updateScores);
api.post('/checklists/new', isAuthenticated, checklists.create);
// Checklist Scores
api.get('/checklist-scores', isAuthenticated, checklistScores.fetch);
// Checklist Questions
api.get('/checklist-questions', checklistQuestions.fetch);
// Mood Options
api.get('/moods', moods.fetch);
api.get('/moods/user', isAuthenticated, moods.fetchByUser);
api.get('/moods/date/:date', isAuthenticated, moods.findByDate);
api.post('/moods/date', isAuthenticated, moods.setByDate);
// Imperatives
api.get('/imperatives', isAuthenticated, imperatives.fetch);
api.post('/imperatives', isAuthenticated, imperatives.create);
api.put('/imperatives/:id', isAuthenticated, imperatives.update);
api.delete('/imperatives/:id', isAuthenticated, imperatives.destroy);
// Gratitudes
api.get('/gratitudes', isAuthenticated, gratitudes.fetch);
api.post('/gratitudes', isAuthenticated, gratitudes.create);
api.put('/gratitudes/:id', isAuthenticated, gratitudes.update);
api.delete('/gratitudes/:id', isAuthenticated, gratitudes.destroy);
// Challenges
api.get('/challenges', isAuthenticated, challenges.fetchActive);
api.get('/challenges/mine', isAuthenticated, challenges.fetchMyChallenges);
api.get('/challenges/date/:date', isAuthenticated, challenges.fetchByDate);
api.post('/challenges', isAuthenticated, challenges.create);
api.put('/challenges/:id', isAuthenticated, challenges.update);
api.delete('/challenges/:id', isAuthenticated, challenges.destroy);
api.post('/challenges/:id/select', isAuthenticated, challenges.selectChallenge);
api.post('/challenges/:id/deselect', isAuthenticated, challenges.deselectChallenge);
api.post('/challenges/:id/subscribe', isAuthenticated, challenges.subscribe);
api.post('/challenges/:id/unsubscribe', isAuthenticated, challenges.unsubscribe);
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
api.get('/stats/checklist-scores-by-task', isAuthenticated, checklists.fetchScoresByTask);
// TODO: name better?
api.get('/stats/categories', isAuthenticated, scorecards.fetchStatsPerCategory);
api.get('/stats/questions', isAuthenticated, checklists.fetchStatsPerQuestion);

module.exports = api;
