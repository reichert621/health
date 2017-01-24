const express = require('express');
const { Users, Entries } = require('./db');
const { Router } = express;

const api = Router();

// For testing
const pong = (req, res) =>
  res.json({ message: 'pong' });

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
    Entries.fetch()
      .then(entries =>
        res.json({ entries })),

  findById: (req, res) =>
    Entries.findById(req.params.id)
      .then(entry =>
        res.json({ entry })),

  create: (req, res) =>
    Entries.create(req.body)
      .then(entry =>
        res.json({ entry })),

  destroy: (req, res) =>
    Entries.destroy(req.params.id)
      .then(entry =>
        res.json({ entry }))
};

api.get('/ping', pong);

api.get('/users', users.fetch);
api.post('/login', users.login);

api.get('/entries', entries.fetch);
api.get('/entries/:id', entries.findById);
api.post('/entries', entries.create);
api.delete('/entries/:id', entries.destroy);

module.exports = api;
