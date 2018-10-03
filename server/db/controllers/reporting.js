const {
  ScoreCard,
  Checklist,
  Task,
  Assessment,
  Reporting
} = require('../index');
const { handleError } = require('./utils');
const { isValidDateFormat } = require('../models/utils');

const { DEPRESSION, ANXIETY, WELL_BEING } = Assessment.AssessmentTypes;

module.exports = {
  fetchWeekStats(req, res) {
    const { params, user } = req;
    const { date } = params;
    const { id: userId } = user;

    return Promise.all([
      ScoreCard.fetchWeekStats(userId, date),
      Checklist.fetchWeekStats(userId, date),
      Assessment.fetchWeekStats(userId, date)
    ])
      .then(([scorecardStats, checklistStats, assessmentStats]) => {
        const stats = { scorecardStats, checklistStats, assessmentStats };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  },

  fetchMonthStats(req, res) {
    const { params, user } = req;
    const { date } = params;
    const { id: userId } = user;

    return Promise.all([
      ScoreCard.fetchMonthStats(userId, date),
      Checklist.fetchMonthStats(userId, date),
      Assessment.fetchMonthStats(userId, date)
    ])
      .then(([scorecardStats, checklistStats, assessmentStats]) => {
        const stats = { scorecardStats, checklistStats, assessmentStats };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  },

  fetchMonthlyAverages(req, res) {
    const { user } = req;
    const { id: userId } = user;

    return Promise.all([
      ScoreCard.fetchAveragesByMonth(userId),
      Assessment.fetchAveragesByMonth(userId)
    ])
      .then(([scorecardStats, assessmentStats]) => {
        const stats = {
          ...assessmentStats,
          productivity: scorecardStats
        };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  },

  fetchCorrelationStats(req, res) {
    const { user, query } = req;
    const { id: userId } = user;
    const { startDate, endDate } = query;
    const dates = {
      startDate: isValidDateFormat(startDate) ? startDate : -Infinity,
      endDate: isValidDateFormat(endDate) ? endDate : Infinity
    };

    return Promise.all([
      ScoreCard.fetchStats(userId, dates),
      Assessment.fetchStats(userId, dates)
    ])
      .then(([scorecardStats, assessmentStats]) => {
        const {
          anxiety: anxietyStats = [],
          depression: depressionStats = [],
          wellbeing: wellBeingStats = []
        } = assessmentStats;

        const results = Reporting.calculateCoefficientStats({
          scorecardStats,
          anxietyStats,
          depressionStats,
          wellBeingStats
        });

        return res.json({ results });
      })
      .catch(err => handleError(res, err));
  },

  // TODO: maybe this is doing too much?
  fetchAllStats(req, res) {
    const { user, query } = req;
    const { id: userId } = user;
    const { startDate, endDate } = query;
    const dates = {
      startDate: isValidDateFormat(startDate) ? startDate : -Infinity,
      endDate: isValidDateFormat(endDate) ? endDate : Infinity
    };

    // TODO: benchmark all these queries
    return Promise.all([
      // Checklists
      Checklist.fetchStats(userId, dates),
      // Scorecards
      ScoreCard.fetchStats(userId, dates),
      ScoreCard.fetchCompletedDays(userId, dates),
      ScoreCard.fetchScoresByDayOfWeek(userId, dates),
      ScoreCard.fetchTotalScoreOverTime(userId, dates),
      ScoreCard.fetchAbilityStats(userId, dates),
      // Tasks
      Task.fetchTopSelected(userId, dates),
      // Assessments
      Assessment.fetchStats(userId, dates),
      // Assessments - Depression
      Assessment.fetchCompletedDaysByType(DEPRESSION, userId, dates),
      Assessment.fetchScoresByDayOfWeek(DEPRESSION, userId, dates),
      Assessment.fetchScoreRangeFrequency(DEPRESSION, userId, dates),
      Assessment.fetchQuestionStats(DEPRESSION, userId, dates),
      Assessment.fetchScoresByTask(DEPRESSION, userId, dates),
      // Assessments - Anxiety
      Assessment.fetchCompletedDaysByType(ANXIETY, userId, dates),
      Assessment.fetchScoresByDayOfWeek(ANXIETY, userId, dates),
      Assessment.fetchScoreRangeFrequency(ANXIETY, userId, dates),
      Assessment.fetchQuestionStats(ANXIETY, userId, dates),
      Assessment.fetchScoresByTask(ANXIETY, userId, dates),
      // Assessments - Wellness
      Assessment.fetchCompletedDaysByType(WELL_BEING, userId, dates),
      Assessment.fetchScoresByDayOfWeek(WELL_BEING, userId, dates),
      Assessment.fetchScoreRangeFrequency(WELL_BEING, userId, dates),
      Assessment.fetchQuestionStats(WELL_BEING, userId, dates),
      Assessment.fetchScoresByTask(WELL_BEING, userId, dates)
    ])
      .then(result => {
        const [
          // Checklist stats // TODO: deprecate!
          checklistStats,
          // Scorecard stats
          scorecardStats,
          completedScorecards,
          scorecardScoresByDay,
          totalScoreOverTime,
          taskAbilityStats,
          // Task stats
          topTasks,
          // Assessment stats
          assessmentStats,
          // Assessments - Depression
          completedDepressionAssessments,
          depressionScoresByDay,
          depressionLevelFrequency,
          depressionQuestionStats,
          depressionScoresByTask,
          // Assessments - Anxiety
          completedAnxietyAssessments,
          anxietyScoresByDay,
          anxietyLevelFrequency,
          anxietyQuestionStats,
          anxietyScoresByTask,
          // Assessments - Wellness
          completedWellnessAssessments,
          wellnessScoresByDay,
          wellnessLevelFrequency,
          wellnessQuestionStats,
          wellnessScoresByTask
        ] = result;

        const {
          anxiety: anxietyStats = [],
          depression: depressionStats = [],
          wellbeing: wellBeingStats = []
        } = assessmentStats;

        const correlationStats = Reporting.calculateCoefficientStats({
          scorecardStats,
          anxietyStats,
          depressionStats,
          wellBeingStats
        });

        const stats = {
          // Checklist stats // TODO: deprecate!
          checklistStats,
          // Scorecard stats
          scorecardStats,
          completedScorecards,
          scorecardScoresByDay,
          totalScoreOverTime,
          taskAbilityStats,
          // Task stats
          topTasks,
          // Assessment stats
          assessmentStats,
          // Aliases for backwards compatibility
          completedChecklists: completedDepressionAssessments,
          checklistScoresByDay: depressionScoresByDay,
          checklistQuestionStats: depressionQuestionStats,
          checklistScoresByTask: depressionScoresByTask,
          depressionLevelFrequency,
          // Assessments - Depression
          completedDepressionAssessments,
          depressionScoresByDay,
          depressionQuestionStats,
          depressionScoresByTask,
          // Assessments - Anxiety
          completedAnxietyAssessments,
          anxietyScoresByDay,
          anxietyLevelFrequency,
          anxietyQuestionStats,
          anxietyScoresByTask,
          // Assessments - Wellness
          completedWellnessAssessments,
          wellnessScoresByDay,
          wellnessLevelFrequency,
          wellnessQuestionStats,
          wellnessScoresByTask,
          // Correlation Coefficients
          correlationStats
        };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  }
};
