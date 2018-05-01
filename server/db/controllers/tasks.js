const { Task, DefaultTasks } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  async fetch(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await Task.fetch({}, userId);

      return res.json({ tasks });
    } catch (err) {
      return handleError(res, err);
    }
  },

  async fetchTopSelected(req, res) {
    try {
      const userId = req.user.id;
      const stats = await Task.fetchTopSelected(userId);

      return res.json({ stats });
    } catch (err) {
      return handleError(res, err);
    }
  },

  async fetchSuggestions(req, res) {
    try {
      const userId = req.user.id;
      const suggestions = await Task.fetchSuggestions(userId);

      return res.json({ suggestions });
    } catch (err) {
      return handleError(res, err);
    }
  },

  fetchDefaults(req, res) {
    try {
      const defaults = Task.fetchDefaults();

      return res.json({ tasks: defaults });
    } catch (err) {
      return handleError(res, err);
    }
  },

  async create(req, res) {
    try {
      const params = req.body;
      const userId = req.user.id;
      // findOrCreate to avoid duplicates
      const task = await Task.findOrCreate(params, userId);

      return res.json({ task });
    } catch (err) {
      return handleError(res, err);
    }
  },

  async createSuggestedTask(req, res) {
    try {
      const params = req.body;
      const userId = req.user.id;
      const task = await Task.createSuggestedTask(params, userId);

      return res.json({ task });
    } catch (err) {
      return handleError(res, err);
    }
  },

  async update(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;
      const updates = req.body;
      const task = await Task.update(taskId, userId, updates);

      return res.json({ task });
    } catch (err) {
      return handleError(res, err);
    }
  }
};
