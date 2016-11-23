const express = require('express');
const ENTRIES = require('./data.json');
const { Router } = express;

const api = Router();

// For testing
const pong = (req, res) =>
  res.json({ message: 'pong' });

const entries = (req, res) =>
  res.json(ENTRIES);

api.get('/ping', pong);
api.get('/entries', entries);

module.exports = api;
