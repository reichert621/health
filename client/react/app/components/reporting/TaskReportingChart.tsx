import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
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
  color?: string;
  zIndex?: number;
  data: number[][];
}

interface ChartProps {}

interface ChartState {
  stats: Item[];
  checklistStats: number[][];
  depressionStats: number[][];
  anxietyStats: number[][];
  wellBeingStats: number[][];
}

class TaskReportingChart extends React.Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);

    this.state = {
      stats: [] as Item[],
      checklistStats: [],
      depressionStats: [],
      anxietyStats: [],
      wellBeingStats: [],
    };
  }

  componentDidMount() {
    return fetchTaskStats()
      .then(([stats, checklistStats, assessmentStats]) => {
        const { depression, anxiety, wellbeing } = assessmentStats;

        return this.setState({
          stats,
          checklistStats,
          depressionStats: depression,
          anxietyStats: anxiety,
          wellBeingStats: wellbeing
        });
      })
      .catch(err => console.log('Error!', err));
  }

  getChartConfig(series: Series[]) {
    const {
      depressionStats = [],
      anxietyStats = [],
      wellBeingStats = []
    } = this.state;
    // const selected = ['Exercise', 'Eat Healthy'];
    // const filtered = series.filter(s => includes(selected, s.name));

    return {
      title: { text: '' },
      chart: {
        height: 200,
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
        opposite: true
      },
      credits: false,
      series: series.concat([
        {
          id: 'depression',
          name: 'Depression',
          color: '#eaeaea',
          zIndex: -1,
          data: depressionStats
        },
        {
          id: 'anxiety',
          name: 'Anxiety',
          color: '#2b2b2b',
          zIndex: -1,
          data: anxietyStats
        },
        // {
        //   id: 'wellbeing',
        //   name: 'Well-Being',
        //   color: '#33A2CC',
        //   zIndex: -1,
        //   data: wellBeingStats
        // },
      ])
    };
  }

  render() {
    // TODO clean up
    const { stats } = this.state;
    const series = stats.map(({ category: name, data }) => {
      return {
        name,
        color: '#91cde4',
        data: data.map(([t, n]) => {
          return n === 0 ? [t, null] : [t, n];
        }),
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

export default TaskReportingChart;
