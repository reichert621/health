import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ReportingChart from '../reporting/ReportingChart';
import { ReportingStats, fetchAllStats } from '../../helpers/reporting';
import { AppState } from '../../helpers/utils';
import { getAllStats } from '../../reducers';
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

// TODO: DRY up (see Reporting)
class DashboardReporting extends React.Component<DashboardReportingProps> {
  constructor(props: DashboardReportingProps) {
    super(props);

    this.state = {
      stats: {} as ReportingStats
    };
  }

  componentDidMount() {
    return this.props.dispatch(getAllStats());
  }

  render() {
    const { stats, onClickPoint } = this.props;
    const { checklistStats, scorecardStats, assessmentStats } = stats;

    return (
      <div className='dashboard-chart-container'>
        <ReportingChart
          checklistStats={checklistStats}
          scorecardStats={scorecardStats}
          assessmentStats={assessmentStats}
          onClickPoint={onClickPoint} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(DashboardReporting);
