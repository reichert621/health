const { ScoreCard, Checklist, Task, Assessment } = require('../index');
const { handleError } = require('./utils');

const { DEPRESSION, ANXIETY, WELL_BEING } = Assessment.AssessmentTypes;

module.exports = {
  fetchWeekStats: (req, res) => {
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
      });
  },

  fetchMonthStats: (req, res) => {
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
      });
  },

  // TODO: maybe this is doing too much?
  fetchAllStats: (req, res) => {
    const userId = req.user.id;

    return Promise.all([
      // Checklists
      Checklist.fetchStats(userId),
      // Scorecards
      ScoreCard.fetchStats(userId),
      ScoreCard.fetchCompletedDays(userId),
      ScoreCard.fetchScoresByDayOfWeek(userId),
      ScoreCard.fetchTotalScoreOverTime(userId),
      ScoreCard.fetchAbilityStats(userId),
      // Tasks
      Task.fetchTopSelected(userId),
      // Assessments
      Assessment.fetchStats(userId),
      // Assessments - Depression
      Assessment.fetchCompletedDaysByType(DEPRESSION, userId),
      Assessment.fetchScoresByDayOfWeek(DEPRESSION, userId),
      Assessment.fetchScoreRangeFrequency(DEPRESSION, userId),
      Assessment.fetchQuestionStats(DEPRESSION, userId),
      Assessment.fetchScoresByTask(DEPRESSION, userId),
      // Assessments - Anxiety
      Assessment.fetchCompletedDaysByType(ANXIETY, userId),
      Assessment.fetchScoresByDayOfWeek(ANXIETY, userId),
      Assessment.fetchScoreRangeFrequency(ANXIETY, userId),
      Assessment.fetchQuestionStats(ANXIETY, userId),
      Assessment.fetchScoresByTask(ANXIETY, userId),
      // Assessments - Wellness
      Assessment.fetchCompletedDaysByType(WELL_BEING, userId),
      Assessment.fetchScoresByDayOfWeek(WELL_BEING, userId),
      Assessment.fetchScoreRangeFrequency(WELL_BEING, userId),
      Assessment.fetchQuestionStats(WELL_BEING, userId),
      Assessment.fetchScoresByTask(WELL_BEING, userId)

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
          wellnessScoresByTask
        };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  }
};
