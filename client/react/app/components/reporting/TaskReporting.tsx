import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import TaskReportingChart from './TaskReportingChart';
import TaskReportingTable from './TaskReportingTable';
import {
  ReportingStats,
  fetchAllStats,
  mergeTaskStats
} from '../../helpers/reporting';
import './Reporting.less';

interface ReportingState {
  stats: ReportingStats;
}

class TaskReporting extends React.Component<RouteComponentProps<{}>, ReportingState> {
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

    const taskStats = mergeTaskStats(topTasks, checklistScoresByTask);
    console.log('taskStats!', taskStats);

    return (
      <div>
        <NavBar
          title='Task Reporting'
          linkTo='/reporting'
          history={history} />

        <div className='default-container'>
          {/* TODO: format this better */}
          <TaskReportingChart />
          <TaskReportingTable stats={taskStats} />
        </div>
      </div>
    );
  }
}

export default TaskReporting;
