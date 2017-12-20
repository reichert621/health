import React from 'react';
import Highcharts from 'react-highcharts';
import _ from 'lodash';
import moment from 'moment';
import { fetchChecklistStats, fetchScorecardStats } from '../helpers/reporting';
import './Reporting.less';

class Reporting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scores: [],
      stats: {}
    };
  }

  componentDidMount() {
    return Promise.all([
      fetchChecklistStats(),
      fetchScorecardStats()
    ])
      .then(([checklistStats, scorecardStats]) => {
        const stats = {
          checklist: checklistStats,
          scorecard: scorecardStats
        };

        return this.setState({ stats });
      })
      .catch(err => {
        console.log('Error fetching scores!', err);
      });
  }

  render() {
    const { checklist, scorecard } = this.state.stats;
    const config = {
      title: { text: 'Reports' },
      xAxis: {
        type: 'datetime'
      },
      series: [
        { data: checklist }, { data: scorecard }
      ]
    };

    return (
      <div className="default-container">
        <h1>Reporting</h1>

        <Highcharts config={config} />
      </div>
    );
  }
}

export default Reporting;
