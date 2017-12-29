import React from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'react-highcharts';
import _ from 'lodash';
import moment from 'moment';
import ReportingChart from './ReportingChart';
import { fetchChecklistStats, fetchScorecardStats, fetchStats } from '../../helpers/reporting';
import './Reporting.less';

class Reporting extends React.Component {
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
      <div className="default-container">
        <Link to="/">Back</Link>
        <h1>Reporting</h1>
        <ReportingChart stats={stats} />
      </div>
    );
  }
}

export default Reporting;
