const { Mood } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch: (req, res) => {
    return Mood.fetch({})
      .then(moods => res.json({ moods }))
      .catch(err => handleError(res, err));
  },

  findByDate: (req, res) => {
    const { params, user } = req;
    const { date } = params;
    const { id: userId } = user;

    return Mood.findByDate(date, userId)
      .then(mood => res.json({ mood }))
      .catch(err => handleError(res, err));
  },

  fetchByUser: (req, res) => {
    const { user } = req;
    const { id: userId } = user;

    return Mood.fetchByUser(userId)
      .then(moods => res.json({ moods }))
      .catch(err => handleError(res, err));
  },

  setByDate: (req, res) => {
    const { body, user } = req;
    const { date, moodId } = body;
    const { id: userId } = user;

    return Mood.setByDate(date, moodId, userId)
      .then(mood => res.json({ mood }))
      .catch(err => handleError(res, err));
  },
};
