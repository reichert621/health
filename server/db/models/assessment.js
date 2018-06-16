const { first, groupBy, isNumber, includes, times } = require('lodash');
const moment = require('moment');
const knex = require('../knex');
const AssessmentQuestion = require('./assessment_question');
const UserAssessment = require('./user_assessment');
const UserAssessmentScore = require('./user_assessment_score');
const { DATE_FORMAT, calculateAverage } = require('./utils');

const AssessmentTypes = {
  DEPRESSION: 'depression',
  ANXIETY: 'anxiety',
  WELL_BEING: 'wellbeing'
};

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

const findByType = (type) => {
  const types = Object.values(AssessmentTypes);

  if (!includes(types, type)) {
    const err = new Error(`Type ${type} must be valid type (${types})`);

    return Promise.reject(err);
  }

  return findOne({ type });
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
  return fetchQuestionsByType(AssessmentTypes.DEPRESSION);
};

const fetchAnxietyQuestions = () => {
  return fetchQuestionsByType(AssessmentTypes.ANXIETY);
};

const fetchWellBeingQuestions = () => {
  return fetchQuestionsByType(AssessmentTypes.WELL_BEING);
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

const formatAssessment = (assessment, questions, scores = []) => {
  const { id, type, title, date } = assessment;
  const scoresByQuestionId = scores.reduce((map, s) => {
    return { ...map, [s.assessmentQuestionId]: s };
  }, {});

  const questionsWithScores = questions.map(question => {
    const { id: questionId } = question;
    const s = scoresByQuestionId[questionId] || null;

    if (s && isNumber(s.score)) {
      return { ...question, score: s.score, assessmentScoreId: s.id };
    } else {
      return question;
    }
  });

  const points = questionsWithScores.reduce((total, { score }) => {
    return isNumber(score) ? total + score : total;
  }, 0);

  return {
    id,
    type,
    title,
    points,
    score: (points / (questions.length * 4)) * 100,
    date: moment.utc(date).format(DATE_FORMAT),
    questions: questionsWithScores,
    isComplete: questionsWithScores.every(q => isNumber(q.score))
  };
};

const fetchUserAssessmentsByType = (userId, type, where = {}) => {
  return Promise.all([
    UserAssessment.fetchByType(type, userId),
    fetchQuestionsByType(type),
    fetchUserAssessmentScoresByType(type, userId)
  ])
    .then(([assessments, questions, scores]) => {
      const scoresByDate = groupBy(scores, ({ date }) => {
        return moment.utc(date).format(DATE_FORMAT);
      });

      return assessments.map(assessment => {
        const { date } = assessment;
        const utc = moment.utc(date).format(DATE_FORMAT);
        const assessmentScores = scoresByDate[utc];

        return formatAssessment(assessment, questions, assessmentScores);
      });
    });
};

const fetchUserAssessments = (userId, where = {}) => {
  const { DEPRESSION, ANXIETY, WELL_BEING } = AssessmentTypes;

  return Promise.all([
    fetchUserAssessmentsByType(userId, DEPRESSION, where),
    fetchUserAssessmentsByType(userId, ANXIETY, where),
    fetchUserAssessmentsByType(userId, WELL_BEING, where)
  ])
    .then(([depression, anxiety, wellbeing]) => {
      return { depression, anxiety, wellbeing };
    });
};

const fetchUserAssessmentById = async (userAssessmentId, userId) => {
  const assessment = await UserAssessment.findById(userAssessmentId, userId);

  if (!assessment) return null;

  const scores = await fetchUserAssessmentScoresById(userAssessmentId, userId);
  const { type } = assessment;
  const questions = await fetchQuestionsByType(type);

  return formatAssessment(assessment, questions, scores);
};

const fetchUserAssessmentsByDate = async (date, userId) => {
  const userAssessments = await UserAssessment.fetchByDate(date, userId);
  const ids = userAssessments.map(a => a.id);
  const assessments = await Promise.all(
    ids.map(id => fetchUserAssessmentById(id, userId))
  );

  return assessments.reduce((mappings, assessment) => {
    const { type } = assessment;

    return { ...mappings, [type]: assessment };
  }, {});
};

// TODO: move to utils
const getDatesInRange = (startDate, endDate) => {
  const diff = moment(endDate).diff(startDate, 'days');

  if (diff < 0) {
    throw new Error(
      `Start date ${startDate} must come before end date ${endDate}!`
    );
  }

  return times(diff).map(n => {
    return moment(startDate).add(n + 1, 'days').format(DATE_FORMAT);
  });
};

const fetchUserAssessmentsByDateRange = (startDate, endDate, userId) => {
  const dates = getDatesInRange(startDate, endDate);
  const promises = dates.map(date => {
    return fetchUserAssessmentsByDate(date, userId).then(assessments => {
      return { date, assessments };
    });
  });

  return Promise.all(promises);
};

const calculateAverageScore = (assessments = []) => {
  const scores = assessments
    .filter(a => a.isComplete && isNumber(a.score))
    .map(a => a.score);

  return calculateAverage(scores);
};

const getAssessmentAverages = (assessments = []) => {
  const depression = assessments.map(a => a.depression).filter(a => a);
  const anxiety = assessments.map(a => a.anxiety).filter(a => a);
  const wellbeing = assessments.map(a => a.wellbeing).filter(a => a);

  return {
    depression: calculateAverageScore(depression),
    anxiety: calculateAverageScore(anxiety),
    wellbeing: calculateAverageScore(wellbeing)
  };
};

const findOrCreateUserAssessment = (type, date, userId) => {
  return findByType(type)
    .then(assessment => {
      const assessmentId = assessment && assessment.id;

      if (!assessmentId) {
        throw new Error(`Invalid assessment type ${type}`);
      }

      return UserAssessment.findOrCreate({ assessmentId, date }, userId);
    });
};

const updateScore = (id, questionId, score, userId) => {
  const where = {
    userAssessmentId: id,
    assessmentQuestionId: questionId
  };

  return UserAssessmentScore.createOrUpdate(where, { score }, userId);
};

const formatStats = (assessments = []) => {
  return assessments
    .sort((x, y) => Number(new Date(x.date)) - Number(new Date(y.date)))
    .map(assessment => {
      const { date, points } = assessment;
      const timestamp = Number(new Date(date));

      return [timestamp, points];
    });
};

const fetchStats = (userId) => {
  return fetchUserAssessments(userId)
    .then(({ wellbeing = [], anxiety = [], depression = [] }) => {
      return {
        wellbeing: formatStats(wellbeing),
        anxiety: formatStats(anxiety),
        depression: formatStats(depression)
      };
    });
};

const extractAssessmentsScores = (assessments = {}) => {
  const { depression, anxiety, wellbeing } = assessments;

  return {
    depression: (depression && depression.score) || null,
    anxiety: (anxiety && anxiety.score) || null,
    wellbeing: (wellbeing && wellbeing.score) || null
  };
};

const fetchWeekStats = (userId) => {
  console.log('Fetching assessment week stats for:', moment().format(DATE_FORMAT));
  const today = moment();
  const day = today.day();
  const thisSunday = moment(today).subtract(day === 0 ? 7 : day, 'days');
  const lastSunday = moment(thisSunday).subtract(1, 'week');
  const thisWeek = [thisSunday.format(DATE_FORMAT), today.format(DATE_FORMAT)];
  const lastWeek = [lastSunday.format(DATE_FORMAT), thisSunday.format(DATE_FORMAT)];

  return Promise.all([
    fetchUserAssessmentsByDateRange(...thisWeek, userId),
    fetchUserAssessmentsByDateRange(...lastWeek, userId)
  ])
    .then(([current, past]) => {
      const date = moment().format(DATE_FORMAT);
      const {
        assessments: todaysAssessments
      } = current.find(a => a && a.date === date) || {};
      const thisWeeksAssessments = current.map(r => r.assessments);
      const lastweeksAssessments = past.map(r => r.assessments);

      return {
        today: extractAssessmentsScores(todaysAssessments),
        thisWeek: getAssessmentAverages(thisWeeksAssessments),
        lastWeek: getAssessmentAverages(lastweeksAssessments)
      };
    });
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
  fetchUserAssessments,
  fetchUserAssessmentById,
  fetchUserAssessmentsByDate,
  findOrCreateUserAssessment,
  updateScore,
  fetchStats,
  fetchWeekStats
};
