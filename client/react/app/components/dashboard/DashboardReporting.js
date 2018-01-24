import React from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'react-highcharts';
import ReportingChart from '../reporting/ReportingChart';
import { fetchAllStats } from '../../helpers/reporting';
import '../reporting/Reporting.less';

// TODO: DRY up (see Reporting)
class DashboardReporting extends React.Component {
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
    const { checklistStats, scorecardStats } = stats;
    const { onClickPoint } = this.props;

    return (
      <div className="dashboard-chart-container">
        <ReportingChart
          checklistStats={checklistStats}
          scorecardStats={scorecardStats}
          onClickPoint={onClickPoint} />
      </div>
    );
  }
}

export default DashboardReporting;
