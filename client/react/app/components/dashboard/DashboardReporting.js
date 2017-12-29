import React from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'react-highcharts';
import ReportingChart from '../reporting/ReportingChart';
import { fetchStats } from '../../helpers/reporting';
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
    return fetchStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { stats } = this.state;

    return (
      <div>
        <h2>Reporting</h2>
        <ReportingChart stats={stats} />
      </div>
    );
  }
}

export default DashboardReporting;
