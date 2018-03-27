const { User, Entry, ScoreCard, Checklist } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  isAuthenticated: (req, res) => {
    const isLoggedIn = Boolean(req.user && req.user.id);

    return res.json({
      isAuthenticated: isLoggedIn,
      currentUser: req.user
    });
  },

  fetch: (req, res) =>
    User.fetch()
      .then(users => res.json({ users }))
      .catch(err => handleError(res, err)),

  // TODO: figure out how to handle relations better
  fetchEntries: (req, res) =>
    User.findByUsername(req.params.username)
      .then(({ id: userId }) =>
        Entry.fetch({ isPrivate: false }, userId))
      .then(entries => res.json({ entries }))
      .catch(err => handleError(res, err)),

  fetchEntry: (req, res) =>
    User.findByUsername(req.params.username)
      .then(({ id: userId }) =>
        Entry.findById(req.params.id, userId, { isPrivate: false }))
      .then(entry => res.json({ entry }))
      .catch(err => handleError(res, err)),

  login: (req, res) =>
    User.authenticate(req.body)
      .then(user => res.json({ user }))
      .catch(err => handleError(res, err)),

  signup: (req, res) => {
    return User.register(req.body)
      .then(user => res.json({ user }))
      .catch(err => handleError(res, err));
  },

  feed: (req, res) => {
    const userId = req.user.id;

    return Promise.all([
      ScoreCard.fetchFriendsCompleted(userId),
      Checklist.fetchFriendsCompleted(userId)
    ])
      .then(([scorecards, checklists]) => {
        return res.json({ scorecards, checklists });
      })
      .catch(err => handleError(res, err));
  }
};
