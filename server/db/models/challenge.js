const { first } = require('lodash');
const moment = require('moment');
const knex = require('../knex');
const UserAccomplishedChallenges = require('./user_accomplished_challenges');

const Challenges = () => knex('challenges');

const fetch = (where = {}) => {
  return Challenges()
    .select()
    .where(where);
};

const fetchActive = (where = {}) => {
  return fetch({ ...where, isActive: true });
};

const findOne = (where = {}) => {
  return fetch(where).first();
};

const findById = (id, where = {}) => {
  return findOne({ ...where, id });
};

const findByUser = (userId, where = {}) => {
  if (!userId) return Promise.reject(new Error('User id is required!'));

  return Challenges()
    .select('c.*')
    .from('challenges as c')
    .innerJoin('challenge_members as cm', 'cm.challengeId', 'c.id')
    .where({ ...where, 'cm.userId': userId, 'c.isActive': true });
};

const findByDate = async (date, userId) => {
  if (!date || !moment(date).isValid()) {
    throw new Error('A valid date is required!');
  }

  const challenges = await findByUser(userId);
  const ids = challenges.map(c => c.id);
  const { fetchChallengeAccomplishments } = UserAccomplishedChallenges;
  const accomplishments = await fetchChallengeAccomplishments(date, ids);

  return challenges.map(challenge => {
    const { id: challengeId } = challenge;
    const accomplishers = accomplishments.filter(a => {
      return Number(a.challengeId) === Number(challengeId);
    });

    const isComplete = accomplishers.some(a => {
      return (Number(a.userId) === Number(userId));
    });

    return { ...challenge, isComplete, accomplishers };
  });
};

const create = (params = {}) => {
  return Challenges()
    .returning('id')
    .insert(params)
    .then(first)
    .then(id => findById(id));
};

const update = (id, updates = {}) => {
  return findById(id)
    .update(updates)
    .then(count => (count > 0))
    .then(success => findById(id));
};

const destroy = (id) => {
  return findById(id).delete();
};

const selectChallenge = (id, date, userId) => {
  const params = { challengeId: id, date, userId };

  return UserAccomplishedChallenges.findOrCreate(params, userId);
};

const deselectChallenge = (id, date, userId) => {
  const params = { challengeId: id, date, userId };

  return UserAccomplishedChallenges.destroyWhere(params, userId);
};

module.exports = {
  fetch,
  fetchActive,
  findById,
  findByUser,
  findByDate,
  create,
  update,
  destroy,
  selectChallenge,
  deselectChallenge
};
