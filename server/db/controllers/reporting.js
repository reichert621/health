const { ScoreCard, Checklist, Task, Assessment } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetchAllStats: (req, res) => {
    const userId = req.user.id;

    return Promise.all([
      // Checklists
      Checklist.fetchStats(userId),
      Checklist.fetchCompletedDays(userId),
      Checklist.fetchScoresByDayOfWeek(userId),
      Checklist.fetchScoreRangeFrequency(userId),
      Checklist.fetchQuestionStats(userId),
      Checklist.fetchScoresByTask(userId),
      // Scorecards
      ScoreCard.fetchStats(userId),
      ScoreCard.fetchCompletedDays(userId),
      ScoreCard.fetchScoresByDayOfWeek(userId),
      ScoreCard.fetchTotalScoreOverTime(userId),
      ScoreCard.fetchAbilityStats(userId),
      // Tasks
      Task.fetchTopSelected(userId),
      // Assessments
      Assessment.fetchStats(userId)
    ])
      .then(result => {
        const [
          // Checklist stats
          checklistStats,
          completedChecklists,
          checklistScoresByDay,
          depressionLevelFrequency,
          checklistQuestionStats,
          checklistScoresByTask,
          // Scorecard stats
          scorecardStats,
          completedScorecards,
          scorecardScoresByDay,
          totalScoreOverTime,
          taskAbilityStats,
          // Task stats
          topTasks,
          // Assessment stats
          assessmentStats
        ] = result;

        const stats = {
          // Checklist stats
          checklistStats,
          completedChecklists,
          checklistScoresByDay,
          depressionLevelFrequency,
          checklistQuestionStats,
          checklistScoresByTask,
          // Scorecard stats
          scorecardStats,
          completedScorecards,
          scorecardScoresByDay,
          totalScoreOverTime,
          taskAbilityStats,
          // Task stats
          topTasks,
          // Assessment stats
          assessmentStats
        };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  }
};
