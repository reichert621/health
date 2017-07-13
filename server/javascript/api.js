const express = require('express');
const passport = require('passport');
const { Users, Entries } = require('./db');
const { auth, isAuthenticated } = require('./passport');
const { Router } = express;

const api = Router();

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
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
        res.status(500).send({ error: err.message })),

  login: (req, res) =>
    Users.authenticate(req.body)
      .then(user =>
        res.json({ user }))
      .catch(err =>
        res.status(500).send({ error: err.message }))
};

const entries = {
  fetch: (req, res) =>
    Entries.fetch({}, req.user.id)
      .then(entries =>
        res.json({ entries }))
      .catch(err =>
        res.status(500).send({ error: err.message })),

  findById: (req, res) =>
    Entries.findById(req.params.id, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        res.status(500).send({ error: err.message })),

  create: (req, res) =>
    Entries.create(req.body, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        res.status(500).send({ error: err.message })),

  update: (req, res) =>
    Entries.update(req.params.id, req.body, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        res.status(500).send({ error: err.message })),

  destroy: (req, res) =>
    Entries.destroy(req.params.id, req.user.id)
      .then(entry =>
        res.json({ entry }))
      .catch(err =>
        res.status(500).send({ error: err.message }))
};

api.get('/ping', pong);

api.get('/users', users.fetch);
api.post('/login', auth, users.login);
api.all('/logout', logout);

api.get('/entries', isAuthenticated, entries.fetch);
api.get('/entries/:id', isAuthenticated, entries.findById);
api.post('/entries', isAuthenticated, entries.create);
api.put('/entries/:id', isAuthenticated, entries.update);
api.delete('/entries/:id', isAuthenticated, entries.destroy);

module.exports = api;
