import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { get, noop } from 'lodash';
import * as moment from 'moment';
import './Reporting.less';

interface ChartProps {
  checklistStats: number[][];
  scorecardStats: number[][];
  onClickPoint?: (timestamp: number) => void;
}

class ReportingChart extends React.Component<ChartProps> {
  // Only re-render if stats length changes
  shouldComponentUpdate({
    checklistStats: nextChecklistStats = [] as number[][],
    scorecardStats: nextScorecardStats = [] as number[][]
  }) {
    const { checklistStats = [], scorecardStats = [] } = this.props;

    if (
      (checklistStats.length === nextChecklistStats.length) &&
      (scorecardStats.length === nextScorecardStats.length)
    ) {
      return false;
    }

    return true;
  }

  render() {
    const {
      checklistStats = [],
      scorecardStats = [],
      onClickPoint = noop
    } = this.props;

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
              click(e: any) {
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
          data: checklistStats
        }, {
          id: 'scorecard',
          name: 'Productivity',
          color: '#33A2CC',
          data: scorecardStats
        }
      ]
    };

    return (
      <div>
        <ReactHighcharts config={config} />
      </div>
    );
  }
}

export default ReportingChart;
