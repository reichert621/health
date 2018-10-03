import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as moment from 'moment';
import ReportingChart from '../reporting/ReportingChart';
import { ReportingStats } from '../../helpers/reporting';
import { DATE_FORMAT, AppState } from '../../helpers/utils';
import { getAllStats } from '../../reducers/stats';
import '../reporting/Reporting.less';

const mapStateToProps = (state: AppState) => {
  const { stats = {} as ReportingStats } = state;

  return { stats };
};

interface DashboardReportingProps {
  stats: ReportingStats;
  onClickPoint: (timestamp: number) => void;
  dispatch: Dispatch<any>;
}

interface DashboardReportingState {
  startDate?: string;
  endDate?: string;
}

// TODO: DRY up (see Reporting)
class DashboardReporting extends React.Component<
  DashboardReportingProps,
  DashboardReportingState
> {
  constructor(props: DashboardReportingProps) {
    super(props);

    this.state = {
      startDate: moment().subtract(3, 'months').format(DATE_FORMAT),
      endDate: moment().format(DATE_FORMAT)
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;

    return this.props.dispatch(getAllStats({ startDate, endDate }));
  }

  render() {
    const { stats, onClickPoint } = this.props;
    const { scorecardStats, assessmentStats } = stats;

    return (
      <div className='dashboard-chart-container'>
        <ReportingChart
          scorecardStats={scorecardStats}
          assessmentStats={assessmentStats}
          onClickPoint={onClickPoint} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(DashboardReporting);
