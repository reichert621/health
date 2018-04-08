import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { get, noop, includes } from 'lodash';
import * as moment from 'moment';
import { fetchMoodStats } from '../../helpers/reporting';
import './Reporting.less';

interface Item {
  question: string;
  data: number[][];
}

interface Series {
  id?: string;
  name?: string;
  data: number[][];
}

interface ChartProps {}

interface ChartState {
  stats: Item[];
  scorecardStats: number[][];
}

class MoodReportingChart extends React.Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);

    this.state = {
      stats: [] as Item[],
      scorecardStats: []
    };
  }

  componentDidMount() {
    return fetchMoodStats()
      .then(([stats, scorecardStats]) => {
        return this.setState({ stats, scorecardStats });
      })
      .catch(err => console.log('Error!', err));
  }

  getChartConfig(series: Series[]) {
    const { scorecardStats = [] } = this.state;

    return {
      title: { text: '' },
      chart: {
        height: 240,
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
                // handle click event
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
        min: 0,
        max: 4,
        minTickInterval: 1,
        opposite: true
      },
      credits: false,
      series
    };
  }

  render() {
    // TODO clean up
    const { stats } = this.state;
    const series = stats
      .filter(({ data }) => {
        return data.some(([t, score]) => score > 0);
      })
      .map(({ question: name, data }) => {
        return {
          name,
          data,
          id: name.toLowerCase().split(' ').join('_')
        };
      });

    return (
      <div>
        {
          series.map(s => {
            const series = [s];
            const config = this.getChartConfig(series);

            return <ReactHighcharts key={s.id} config={config} />;
          })
        }
      </div>
    );
  }
}

export default MoodReportingChart;
