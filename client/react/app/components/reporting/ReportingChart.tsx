import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { get, noop } from 'lodash';
import * as moment from 'moment';
import './Reporting.less';

interface ChartProps {
  checklistStats?: number[][];
  scorecardStats: number[][];
  assessmentStats?: { [type: string]: number[][]; };
  onClickPoint?: (timestamp: number) => void;
}

class ReportingChart extends React.Component<ChartProps> {
  // Only re-render if stats length changes
  shouldComponentUpdate({
    assessmentStats: nextAssessmentStats = {} as { [type: string]: number[][]; },
    scorecardStats: nextScorecardStats = [] as number[][]
  }) {
    const { assessmentStats = {}, scorecardStats = [] } = this.props;
    const {
      wellbeing = [],
      anxiety = [],
      depression = []
    } = assessmentStats;
    const {
      wellbeing: nextWellBeing = [],
      anxiety: nextAnxiety = [],
      depression: nextDepression = []
    } = nextAssessmentStats;

    if (
      (wellbeing.length === nextWellBeing.length) &&
      (anxiety.length === nextAnxiety.length) &&
      (depression.length === nextDepression.length) &&
      (scorecardStats.length === nextScorecardStats.length)
    ) {
      return false;
    }

    return true;
  }

  render() {
    const {
      assessmentStats = {},
      scorecardStats = [],
      onClickPoint = noop
    } = this.props;
    const {
      wellbeing = [],
      anxiety = [],
      depression = []
    } = assessmentStats;

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
          id: 'scorecard',
          name: 'Productivity',
          color: '#91cde4',
          data: scorecardStats
        },
        {
          id: 'checklist',
          name: 'Depression',
          color: '#eaeaea',
          data: depression
        }, {
          id: 'anxiety',
          name: 'Anxiety',
          color: '#2b2b2b',
          data: anxiety
        }, {
          id: 'wellbeing',
          name: 'Well-Being',
          color: '#33A2CC',
          data: wellbeing
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
