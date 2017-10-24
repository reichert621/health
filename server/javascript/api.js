const express = require('express');
const passport = require('passport');
const { Users, Entries } = require('./db');
const { auth, isAuthenticated } = require('./passport');
const { Router } = express;

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

api.get('/ping', pong);

api.post('/login', auth, users.login);
api.all('/logout', logout);

api.get('/entries', isAuthenticated, entries.fetch);
api.get('/entries/:id', isAuthenticated, entries.findById);
api.post('/entries', isAuthenticated, entries.create);
api.put('/entries/:id', isAuthenticated, entries.update);
api.delete('/entries/:id', isAuthenticated, entries.destroy);

api.get('/users', users.fetch);
api.get('/users/:username/entries', users.fetchEntries);
api.get('/users/:username/entries/:id', users.fetchEntry);

module.exports = api;
