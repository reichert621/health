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
import {
  TaskAssessmentStats,
  fetchStats as fetchTaskStats
} from '../../helpers/tasks';
import './Reporting.less';

interface ReportingState {
  stats: TaskAssessmentStats[];
}

class TaskReporting extends React.Component<RouteComponentProps<{}>, ReportingState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      stats: []
    };
  }

  componentDidMount() {
    return fetchTaskStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { stats } = this.state;
    console.log('stats!', stats);

    return (
      <div>
        <NavBar
          title='Task Reporting'
          linkTo='/reporting'
          history={history} />

        <div className='default-container'>
          {/* TODO: format this better */}
          <TaskReportingTable stats={stats} />
        </div>
      </div>
    );
  }
}

export default TaskReporting;
