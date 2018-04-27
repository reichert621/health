const { Challenge } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetch(req, res) {
    return Challenge.fetch({})
      .then(challenges => res.json({ challenges }))
      .catch(err => handleError(res, err));
  },

  fetchMyChallenges(req, res) {
    const { id: userId } = req.user;

    return Challenge.findByUser(userId)
      .then(challenges => res.json({ challenges }))
      .catch(err => handleError(res, err));
  },

  fetchByDate(req, res) {
    const { params, user } = req;
    const { date } = params;
    const { id: userId } = user;

    return Challenge.findByDate(date, userId)
      .then(challenges => res.json({ challenges }))
      .catch(err => handleError(res, err));
  },

  create(req, res) {
    const { body: params } = req;

    return Challenge.create(params)
      .then(challenge => res.json({ challenge }))
      .catch(err => handleError(res, err));
  },

  update(req, res) {
    const { body: updates, params } = req;
    const { id: challengeId } = params;

    return Challenge.update(challengeId, updates)
      .then(challenge => res.json({ challenge }))
      .catch(err => handleError(res, err));
  },

  destroy(req, res) {
    const { id: challengeId } = req.params;

    return Challenge.destroy(challengeId)
      .then(challenge => res.json({ challenge }))
      .catch(err => handleError(res, err));
  },

  selectChallenge: (req, res) => {
    const { params, body, user } = req;
    const { id: challengeId } = params;
    const { id: userId } = user;
    const { date } = body;

    return Challenge.selectChallenge(challengeId, date, userId)
      .then(result => res.json({ success: !!result }))
      .catch(err => handleError(res, err));
  },

  deselectChallenge: (req, res) => {
    const { params, body, user } = req;
    const { id: challengeId } = params;
    const { id: userId } = user;
    const { date } = body;

    return Challenge.deselectChallenge(challengeId, date, userId)
      .then(removed => res.json({ success: removed > 0 }))
      .catch(err => handleError(res, err));
  }
};
