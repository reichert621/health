import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import TaskReportingTable from './TaskReportingTable';
import {
  TaskAssessmentStats,
  fetchStats as fetchTaskStats
} from '../../helpers/tasks';
import { getDefaultDateRange } from '../../helpers/utils';
import './Reporting.less';

interface ReportingState {
  startDate: string;
  endDate: string;
  stats: TaskAssessmentStats[];
}

class TaskReporting extends React.Component<RouteComponentProps<{}>, ReportingState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    const query = props.location.search;
    const { startDate, endDate } = getDefaultDateRange(query);

    this.state = {
      startDate,
      endDate,
      stats: []
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;

    return fetchTaskStats({ startDate, endDate })
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
