import * as React from 'react';
import ReportingChart from '../reporting/ReportingChart';
import { ReportingStats, fetchAllStats } from '../../helpers/reporting';
import '../reporting/Reporting.less';

interface DashboardReportingProps {
  onClickPoint: (timestamp: number) => void;
}

interface DashboardReportingState {
  stats: ReportingStats;
}

// TODO: DRY up (see Reporting)
class DashboardReporting extends React.Component<
  DashboardReportingProps,
  DashboardReportingState
> {
  constructor(props: DashboardReportingProps) {
    super(props);

    this.state = {
      stats: {} as ReportingStats
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
    const { checklistStats, scorecardStats } = stats;
    const { onClickPoint } = this.props;

    return (
      <div className='dashboard-chart-container'>
        <ReportingChart
          checklistStats={checklistStats}
          scorecardStats={scorecardStats}
          onClickPoint={onClickPoint} />
      </div>
    );
  }
}

export default DashboardReporting;
