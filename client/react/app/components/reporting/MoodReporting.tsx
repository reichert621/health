import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import MoodReportingChart from './MoodReportingChart';
import MoodReportingTable from './MoodReportingTable';
import { ReportingStats, fetchAllStats } from '../../helpers/reporting';
import './Reporting.less';

interface ReportingState {
  stats: ReportingStats;
}

class MoodReporting extends React.Component<RouteComponentProps<{}>, ReportingState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      stats: {} as ReportingStats
    };
  }

  componentDidMount() {
    // TODO: only fetch required stats
    return fetchAllStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { stats } = this.state;
    const {
      // Checklist stats
      checklistStats = [],
      completedChecklists = [],
      checklistScoresByDay = {},
      depressionLevelFrequency = {},
      checklistQuestionStats = [],
      checklistScoresByTask = [],
      // Scorecard stats
      scorecardStats = [],
      completedScorecards = [],
      scorecardScoresByDay = {},
      totalScoreOverTime = [],
      taskAbilityStats = {},
      // Task stats
      topTasks = []
    } = stats;

    return (
      <div>
        <NavBar
          title='Mood Reporting'
          linkTo='/'
          history={history} />

        <div className='default-container'>
          {/* TODO: format this better */}
          <MoodReportingChart />
          <MoodReportingTable stats={checklistQuestionStats} />
        </div>
      </div>
    );
  }
}

export default MoodReporting;
