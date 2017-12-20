const express = require('express');
const passport = require('passport');
const { auth, isAuthenticated } = require('./passport');
const { Router } = express;
const {
  Users,
  Entries,
  ScoreCard,
  Task,
  Checklist,
  ChecklistScore,
  ChecklistQuestion
} = require('./db'); // TODO: standardize singular vs plural

const api = Router();

// TODO: use middleware for better error handling
const handleError = (res, err) => {
  console.error('An error occurred!', err);

  return res
    .status(500)
    .send({ status: 500, error: err.message });
};

const logout = (req, res) => {
  req.logout();

  return res
    .status(200)
    .send({ status: 200 });
};

// For testing
const pong = (req, res) =>
  res.json({ message: 'pong' });

// TODO: move to controllers
const users = {
  fetch: (req, res) =>
    Users.fetch()
      .then(users =>
        res.json({ users }))
      .catch(err =>
        handleError(res, err)),

  // TODO: figure out how to handle relations better
  fetchEntries: (req, res) =>
    Users.findByUsername(req.params.username)
      .then(({ id: userId }) =>
        Entries.fetch({ isPrivate: false }, userId))
      .then(entries =>
        res.json({ entries }))
      .catch(err =>
        handleError(res, err)),

  fetchEntry: (req, res) =>
    Users.findByUsername(req.params.username)
      .then(({ id: userId }) =>
        Entries.findById(req.params.id, userId, { isPrivate: false }))
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  login: (req, res) =>
    Users.authenticate(req.body)
      .then(user =>
        res.json({ user }))
      .catch(err =>
        handleError(res, err))
};

const entries = {
  fetch: (req, res) =>
    Entries.fetch({}, req.user.id)
      .then(entries =>
        res.json({ entries }))
      .catch(err =>
        handleError(res, err)),

  findById: (req, res) =>
    Entries.findById(req.params.id, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  create: (req, res) =>
    Entries.create(req.body, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  update: (req, res) =>
    Entries.update(req.params.id, req.body, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  destroy: (req, res) =>
    Entries.destroy(req.params.id, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err))
};

const scorecards = {
  findById: (req, res) => {
    return ScoreCard.findById(req.params.id, req.user.id)
      .then(scorecard =>
        res.json({ scorecard }))
      .catch(err =>
        handleError(res, err));
  },

  updateSelectedTasks: (req, res) => {
    return ScoreCard.updateSelectedTasks(req.params.id, req.body, req.user.id)
      .then(updates =>
        res.json({ updates }))
      .catch(err =>
        handleError(res, err));
  },

  fetchStats: (req, res) => {
    return ScoreCard.fetchStats(req.user.id)
      .then(stats => {
        return res.json({ stats });
      })
      .catch(err =>
        handleError(res, err));
  }
};

const tasks = {
  fetch: (req, res) =>
    Task.fetch()
      .then(tasks => res.json({ tasks }))
      .catch(err => handleError(res, err))
};

const checklists = {
  findById: (req, res) => {
    return Checklist.findById(req.params.id, req.user.id)
      .then(checklist => {
        return res.json({ checklist });
      })
      .catch(err =>
        handleError(res, err));
  },

  updateScores: (req, res) => {
    return Checklist.updateScores(req.params.id, req.body, req.user.id)
      .then(updates =>
        res.json({ updates }))
      .catch(err =>
        handleError(res, err));
  },

  fetchStats: (req, res) => {
    return Checklist.fetchStats(req.user.id)
      .then(stats => {
        return res.json({ stats });
      })
      .catch(err =>
        handleError(res, err));
  }
};

const checklistScores = {
  fetch: (req, res) =>
    ChecklistScore.fetch({}, req.user.id)
      .then(scores => res.json({ scores }))
      .catch(err => handleError(res, err))
};

const checklistQuestions = {
  fetch: (req, res) =>
    ChecklistQuestion.fetch()
      .then(questions => res.json({ questions }))
      .catch(err => handleError(res, err))
};

// Testing async/await
const t = {
  async fetch(req, res) {
    try {
      const tasks = await Task.fetch();

      return res.json({ tasks });
    } catch (err) {
      return handleError(res, err);
    }
  }
};

api.get('/ping', pong);
// Auth
api.post('/login', auth, users.login);
api.all('/logout', logout);
// Entries
api.get('/entries', isAuthenticated, entries.fetch);
api.get('/entries/:id', isAuthenticated, entries.findById);
api.post('/entries', isAuthenticated, entries.create);
api.put('/entries/:id', isAuthenticated, entries.update);
api.delete('/entries/:id', isAuthenticated, entries.destroy);
// Users
api.get('/users', users.fetch);
api.get('/users/:username/entries', users.fetchEntries);
api.get('/users/:username/entries/:id', users.fetchEntry);
// Scorecards
api.get('/scorecards/:id', isAuthenticated, scorecards.findById);
api.post('/scorecards/:id/update-selected-tasks', isAuthenticated, scorecards.updateSelectedTasks);
// Tasks
api.get('/tasks', t.fetch);
// Checklists
api.get('/checklists/:id', isAuthenticated, checklists.findById);
api.post('/checklists/:id/update-scores', isAuthenticated, checklists.updateScores);
// Checklist Scores
api.get('/checklist-scores', isAuthenticated, checklistScores.fetch);
// Checklist Questions
api.get('/checklist-questions', checklistQuestions.fetch);
// Reporting Stats
api.get('/stats/checklists', isAuthenticated, checklists.fetchStats);
api.get('/stats/scorecards', isAuthenticated, scorecards.fetchStats);

module.exports = api;
