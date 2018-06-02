const { first, groupBy, isNumber } = require('lodash');
const moment = require('moment');
const knex = require('../knex');
const AssessmentQuestion = require('./assessment_question');
const UserAssessment = require('./user_assessment');
const UserAssessmentScore = require('./user_assessment_score');

const { DEPRESSION, ANXIETY, WELL_BEING } = AssessmentQuestion.types;

const Assessment = () => knex('assessments');

const fetch = (where = {}) => {
  return Assessment()
    .select()
    .where(where);
};

const findOne = (where = {}) => {
  return fetch(where).first();
};

const findById = (id, where = {}) => {
  return findOne({ ...where, id });
};

const create = (params) => {
  return Assessment()
    .returning('id')
    .insert(params)
    .then(first)
    .then(id => findById(id));
};

const update = (id, params) => {
  return findById(id)
    .update(params)
    .then(count => (count > 0))
    .then(success => findById(id));
};

const destroy = (id) => {
  return findById(id).delete();
};

// TODO: move to assessment question model?
const fetchQuestionsByType = (type) => {
  return Assessment()
    .select('a.type', 'a.title', 'aq.*')
    .from('assessments as a')
    .innerJoin('assessment_questions as aq', 'aq.assessmentId', 'a.id')
    .where({ 'a.type': type });
};

const fetchDepressionQuestions = () => {
  return fetchQuestionsByType(DEPRESSION);
};

const fetchAnxietyQuestions = () => {
  return fetchQuestionsByType(ANXIETY);
};

const fetchWellBeingQuestions = () => {
  return fetchQuestionsByType(WELL_BEING);
};

const fetchUserAssessmentScores = (userId, where = {}) => {
  return Assessment()
    .select('a.type', 'a.title', 'ua.date', 'uas.*')
    .from('assessments as a')
    .innerJoin('user_assessments as ua', 'ua.assessmentId', 'a.id')
    .innerJoin('user_assessment_scores as uas', 'uas.userAssessmentId', 'ua.id')
    .where({ 'ua.userId': userId, ...where });
};

const fetchUserAssessmentScoresByType = (type, userId) => {
  return fetchUserAssessmentScores(userId, { 'a.type': type });
};

const fetchUserAssessmentScoresById = (userAssessmentId, userId) => {
  return fetchUserAssessmentScores(userId, { 'ua.id': userAssessmentId });
};

const formatAssessment = (date, questions, scores) => {
  const scoresByQuestionId = scores.reduce((map, s) => {
    return { ...map, [s.assessmentQuestionId]: s };
  }, {});

  const questionsWithScores = questions.map(question => {
    const { id } = question;
    const s = scoresByQuestionId[id] || null;

    if (s && isNumber(s.score)) {
      return { ...question, score: s.score, assessmentScoreId: s.id };
    } else {
      return question;
    }
  });

  return {
    date: moment.utc(date).format('YYYY-MM-DD'),
    questions: questionsWithScores,
    points: questionsWithScores.reduce((total, { score }) => {
      return isNumber(score) ? total + score : total;
    }, 0)
  };
};

const fetchUserAssessmentsByType = (userId, type) => {
  return Promise.all([
    fetchQuestionsByType(type),
    fetchUserAssessmentScoresByType(type, userId)
  ])
    .then(([questions, scores]) => {
      const assessments = groupBy(scores, ({ date }) => {
        return moment.utc(date).format('YYYY-MM-DD');
      });

      return Object.keys(assessments).map(date => {
        return formatAssessment(date, questions, assessments[date]);
      });
    });
};

const fetchUserAssessmentById = async (userAssessmentId, userId) => {
  const assessment = await UserAssessment.findById(userAssessmentId, userId);

  if (!assessment) return null;

  const scores = await fetchUserAssessmentScoresById(userAssessmentId, userId);
  const { date, type, title } = assessment;
  const questions = await fetchQuestionsByType(type);

  return formatAssessment(date, questions, scores);
};

const updateScore = (id, questionId, score, userId) => {
  const where = {
    userAssessmentId: id,
    assessmentQuestionId: questionId
  };

  return UserAssessmentScore.createOrUpdate(where, { score }, userId);
};

module.exports = {
  fetch,
  findById,
  create,
  update,
  destroy,
  fetchDepressionQuestions,
  fetchAnxietyQuestions,
  fetchWellBeingQuestions,
  fetchUserAssessmentsByType,
  fetchUserAssessmentById,
  updateScore
};
