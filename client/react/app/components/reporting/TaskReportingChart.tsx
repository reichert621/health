import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { get, noop, includes } from 'lodash';
import * as moment from 'moment';
import { fetchTaskStats } from '../../helpers/reporting';
import './Reporting.less';

interface Item {
  category: string;
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
  checklistStats: number[][];
}

class TaskReportingChart extends React.Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);

    this.state = {
      stats: [] as Item[],
      checklistStats: []
    };
  }

  componentDidMount() {
    return fetchTaskStats()
      .then(([stats, checklistStats]) => {
        return this.setState({ stats, checklistStats });
      })
      .catch(err => console.log('Error!', err));
  }

  getChartConfig(series: Series[]) {
    const { checklistStats = [] } = this.state;
    const selected = ['Exercise', 'Eat Healthy'];
    const filtered = series.filter(s => includes(selected, s.name));

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
                const timestamp = get(e, 'point.options.x');

                // return onClickPoint(timestamp);
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
      series: series.concat({
        id: 'checklists',
        name: 'Depression',
        data: checklistStats
      })
    };
  }

  render() {
    // TODO clean up
    const { stats } = this.state;
    const series = stats.map(({ category: name, data }) => {
      return {
        name,
        data: data.map(([t, n]) => {
          return n === 0 ? [t, null] : [t, n];
        }),
        id: name.toLowerCase().split(' ').join('_')
      };
    });

    const config = this.getChartConfig(series);

    return (
      <div>
        {
          series.map(s => {
            const series = [s];
            const config = this.getChartConfig(series);

            return <ReactHighcharts key={s.id} config={config} />;
          })
        }
        {/* <ReactHighcharts config={config} /> */}
      </div>
    );
  }
}

export default TaskReportingChart;
