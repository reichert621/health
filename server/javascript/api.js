const express = require('express');
const { auth, isAuthenticated } = require('./passport');

const { Router } = express;
const {
  User,
  Entry,
  ScoreCard,
  Category,
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
  isAuthenticated: (req, res) => {
    const isLoggedIn = Boolean(req.user && req.user.id);

    return res.json({ isAuthenticated: isLoggedIn });
  },

  fetch: (req, res) =>
    User.fetch()
      .then(users =>
        res.json({ users }))
      .catch(err =>
        handleError(res, err)),

  // TODO: figure out how to handle relations better
  fetchEntries: (req, res) =>
    User.findByUsername(req.params.username)
      .then(({ id: userId }) =>
        Entry.fetch({ isPrivate: false }, userId))
      .then(entries =>
        res.json({ entries }))
      .catch(err =>
        handleError(res, err)),

  fetchEntry: (req, res) =>
    User.findByUsername(req.params.username)
      .then(({ id: userId }) =>
        Entry.findById(req.params.id, userId, { isPrivate: false }))
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  login: (req, res) =>
    User.authenticate(req.body)
      .then(user =>
        res.json({ user }))
      .catch(err =>
        handleError(res, err)),

  signup: (req, res) => {
    console.log('REQ', req.body);
    return User.create(req.body)
      .then(user =>
        res.json({ user }))
      .catch(err =>
        handleError(res, err));
  }
};

const entries = {
  fetch: (req, res) =>
    Entry.fetch({}, req.user.id)
      .then(entries =>
        res.json({ entries }))
      .catch(err =>
        handleError(res, err)),

  findById: (req, res) =>
    Entry.findById(req.params.id, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  create: (req, res) =>
    Entry.create(req.body, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  update: (req, res) =>
    Entry.update(req.params.id, req.body, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err)),

  destroy: (req, res) =>
    Entry.destroy(req.params.id, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        handleError(res, err))
};

const scorecards = {
  fetch: (req, res) => {
    return ScoreCard.fetchWithPoints({}, req.user.id)
      .then(scorecards => res.json({ scorecards }))
      .catch(err => handleError(res, err));
  },

  findById: (req, res) => {
    return ScoreCard.findById(req.params.id, req.user.id)
      .then(scorecard =>
        res.json({ scorecard }))
      .catch(err =>
        handleError(res, err));
  },

  create: (req, res) => {
    return ScoreCard.createWithScores(req.body, req.user.id)
      .then(scorecard => {
        return res.json({ scorecard });
      })
      .catch(err => handleError(res, err));
  },

  selectTask: (req, res) => {
    const { id, taskId } = req.params;

    return ScoreCard.selectTask(id, taskId, req.user.id)
      .then(selectedTask => {
        return res.json({ success: !!selectedTask });
      })
      .catch(err => {
        return handleError(res, err);
      });
  },

  deselectTask: (req, res) => {
    const { id, taskId } = req.params;

    return ScoreCard.deselectTask(id, taskId, req.user.id)
      .then(removed => {
        return res.json({ success: removed > 0 });
      })
      .catch(err => {
        return handleError(res, err);
      });
  },

  update: (req, res) => {
    return ScoreCard.update(req.params.id, req.body, req.user.id)
      .then(scorecard => {
        return res.json({ scorecard });
      })
      .catch(err => {
        return handleError(res, err);
      });
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

const categories = {
  fetch: (req, res) =>
    Category.fetch({}, req.user.id)
      .then(categories => res.json({ categories }))
      .catch(err => handleError(res, err)),

  create: (req, res) => {
    return Category.create(req.body, req.user.id)
      .then(category => {
        return res.json({ category });
      })
      .catch(err => handleError(res, err));
  }
};

const tasks = {
  fetch: (req, res) =>
    Task.fetch()
      .then(tasks => res.json({ tasks }))
      .catch(err => handleError(res, err)),

  create: (req, res) => {
    return Task.create(req.body, req.user.id)
      .then(task => {
        return res.json({ task });
      })
      .catch(err => handleError(res, err));
  }
};

const checklists = {
  fetch: (req, res) => {
    return Checklist.fetchWithPoints({}, req.user.id)
      .then(checklists => res.json({ checklists }))
      .catch(err => handleError(res, err));
  },

  create: (req, res) => {
    return Checklist.createWithScores(req.body, req.user.id)
      .then(checklist => {
        return res.json({ checklist });
      })
      .catch(err => handleError(res, err));
  },

  findById: (req, res) => {
    return Checklist.findById(req.params.id, req.user.id)
      .then(checklist => res.json({ checklist }))
      .catch(err =>
        handleError(res, err));
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
      const userId = req.user.id;
      const tasks = await Task.fetch({}, userId);

      return res.json({ tasks });
    } catch (err) {
      return handleError(res, err);
    }
  },

  async create(req, res) {
    try {
      const params = req.body;
      const userId = req.user.id;
      const task = await Task.create(params, userId);

      return res.json({ task });
    } catch (err) {
      return handleError(res, err);
    }
  }
};

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
api.get('/users', users.fetch);
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
api.get('/tasks', isAuthenticated, t.fetch);
api.post('/tasks', isAuthenticated, t.create);
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
api.get('/stats/checklists', isAuthenticated, checklists.fetchStats);
api.get('/stats/scorecards', isAuthenticated, scorecards.fetchStats);

module.exports = api;
