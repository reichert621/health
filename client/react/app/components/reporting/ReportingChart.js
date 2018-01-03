import React from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'react-highcharts';
import './Reporting.less';

class ReportingChart extends React.Component {
  // Only re-render if stats length changes
  shouldComponentUpdate({ stats }) {
    const { stats: currentStats } = this.props;
    const { checklist = [], scorecard = [] } = currentStats;
    const {
      checklist: nextChecklist = [],
      scorecard: nextScorecard = []
    } = stats;

    if (
      (checklist.length === nextChecklist.length) &&
      (scorecard.length === nextScorecard.length)
    ) {
      return false;
    }

    return true;
  }

  render() {
    const { stats = {} } = this.props;
    const { checklist, scorecard } = stats;
    const config = {
      title: { text: '' },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Points'
        }
      },
      credits: false,
      series: [
        {
          id: 'checklist',
          name: 'Depression',
          data: checklist
        }, {
          id: 'scorecard',
          name: 'Productivity',
          data: scorecard
        }
      ]
    };

    return (
      <div>
        <Highcharts config={config} />
      </div>
    );
  }
}

export default ReportingChart;
