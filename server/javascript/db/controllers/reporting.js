const { ScoreCard, Checklist, Task } = require('../index');
const { handleError } = require('./utils');

module.exports = {
  fetchAllStats: (req, res) => {
    const userId = req.user.id;

    return Promise.all([
      Checklist.fetchStats(userId),
      Checklist.fetchCompletedDays(userId),
      Checklist.fetchScoresByDayOfWeek(userId),
      Checklist.fetchScoreRangeFrequency(userId),

      ScoreCard.fetchStats(userId),
      ScoreCard.fetchCompletedDays(userId),
      ScoreCard.fetchScoresByDayOfWeek(userId),
      ScoreCard.fetchTotalScoreOverTime(userId),
      ScoreCard.fetchCategoryStats(userId),

      Task.fetchTopSelected(userId)
    ])
      .then(result => {
        const [
          // Checklist stats
          checklistStats,
          completedChecklists,
          checklistScoresByDay,
          depressionLevelFrequency,
          // Scorecard stats
          scorecardStats,
          completedScorecards,
          scorecardScoresByDay,
          totalScoreOverTime,
          taskCategoryStats,
          // Task stats
          topTasks
        ] = result;

        const stats = {
          // Checklist stats
          checklistStats,
          completedChecklists,
          checklistScoresByDay,
          depressionLevelFrequency,
          // Scorecard stats
          scorecardStats,
          completedScorecards,
          scorecardScoresByDay,
          totalScoreOverTime,
          taskCategoryStats,
          // Task stats
          topTasks
        };

        return res.json({ stats });
      })
      .catch(err => handleError(res, err));
  }
};
