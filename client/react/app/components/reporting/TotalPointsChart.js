import React from 'react';
import Highcharts from 'react-highcharts';
import { get, noop } from 'lodash';
import moment from 'moment';
import './Reporting.less';

class TotalPointsChart extends React.Component {
  render() {
    const { stats = [], onClickPoint = noop } = this.props;
    const totalScores = stats.map(({ timestamp, totalScore }) => {
      return [timestamp, totalScore];
    });

    const completedTasks = stats.map(({ timestamp, totalTasks }) => {
      return [timestamp, totalTasks];
    });

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
          id: 'total',
          name: 'Scores',
          color: '#33A2CC',
          data: totalScores
        }, {
          id: 'tasks',
          name: 'Tasks',
          color: '#5E5E5E',
          data: completedTasks
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

export default TotalPointsChart;
