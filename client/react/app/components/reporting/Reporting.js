import React from 'react';
import { Link } from 'react-router-dom';
import ReportingChart from './ReportingChart';
import ReportingStreaks from './ReportingStreaks';
import TopTasks from './TopTasks';
import MoodFrequency from './MoodFrequency';
import ScoresByDay from './ScoresByDay';
import ScoresByCategory from './ScoresByCategory';
import TotalPointsChart from './TotalPointsChart';
import { fetchAllStats } from '../../helpers/reporting';
import './Reporting.less';

class Reporting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stats: {}
    };
  }

  componentDidMount() {
    return fetchAllStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { stats } = this.state;
    const {
      // Checklist stats
      checklistStats = [],
      completedChecklists = [],
      checklistScoresByDay = {},
      depressionLevelFrequency = {},
      checklistQuestionStats = [],
      // Scorecard stats
      scorecardStats = [],
      completedScorecards = [],
      scorecardScoresByDay = {},
      totalScoreOverTime = [],
      taskCategoryStats = {},
      // Task stats
      topTasks = []
    } = stats;

    console.log('stats!', stats);

    return (
      <div className="default-container">
        <Link to="/">Back</Link>

        <h1>Scores By Day</h1>
        <ScoresByDay
          checklistScores={checklistScoresByDay}
          scorecardScores={scorecardScoresByDay} />

        <h1>Scores By Category</h1>
        <ScoresByCategory
          categoryStats={taskCategoryStats} />

        <h1>Top Tasks</h1>
        <TopTasks tasks={topTasks} />

        <h1>Mood Frequency</h1>
        <MoodFrequency stats={depressionLevelFrequency} />

        <h1>Streaks</h1>
        <ReportingStreaks
          completedChecklists={completedChecklists}
          completedScorecards={completedScorecards} />

        <h1>Reporting</h1>
        <ReportingChart
          checklistStats={checklistStats}
          scorecardStats={scorecardStats} />

        <h1>Total Points</h1>
        <div style={{ width: '50%' }}>
          <TotalPointsChart stats={totalScoreOverTime} />
        </div>
      </div>
    );
  }
}

export default Reporting;
