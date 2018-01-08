import React from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'react-highcharts';
import { get } from 'lodash';
import moment from 'moment';
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
    const { stats = {}, onClickPoint } = this.props;
    const { checklist, scorecard } = stats;
    const config = {
      title: { text: '' },
      chart: {
        height: 480,
        style: {
          fontFamily: 'Helvetica Neue',
          letterSpacing: '0.6px'
        }
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click(e) {
                const timestamp = get(e, 'point.options.x');

                return onClickPoint(timestamp);
              }
            }
          }
        }
      },
      xAxis: {
        type: 'datetime',
        labels: {
          style: {
            color: '#5E5E5E',
            fontSize: 12
          },
          y: 22,
          formatter() {
            return moment(this.value).format('MMM DD');
          }
        }
      },

      yAxis: {
        title: {
          text: 'Points'
        },
        opposite: true
      },
      credits: false,
      series: [
        {
          id: 'checklist',
          name: 'Depression',
          color: '#5E5E5E',
          data: checklist
        }, {
          id: 'scorecard',
          name: 'Productivity',
          color: '#33A2CC',
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
