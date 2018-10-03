import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import * as moment from 'moment';
import {
  times,
  sample,
  chunk,
  keys,
  isEqual,
  isEmpty,
  isNumber,
  first,
  last
} from 'lodash';
import { all } from 'bluebird';
import { DATE_FORMAT, getStreakStats, calculateAverage } from '../../helpers/utils';
import {
  ReportingStats,
  CorrelationStats,
  MonthlyAverageStats,
  fetchAllStats,
  fetchWeekStats,
  fetchMonthStats,
  normalizeWellnessScore,
  calculateHappiness,
  fetchMonthlyAverages,
  MonthlyAverage
} from '../../helpers/reporting';
import {
  TaskAssessmentStats,
  fetchStats as fetchTaskStats
} from '../../helpers/tasks';
import NavBar from '../navbar';

const colors = {
  BLUE: '#80A0C0',
  LIGHT_BEIGE: '#FBF6F0',
  BEIGE: '#F4E6DB',
  WHITE: '#fff',
  BLACK: '#382210',
  RED: '#C76666',
  ORANGE: '#E5AF70',
  ORANGE_BROWN: '#E6AF70',
  LIGHT_GREEN: '#C7D99A',
  DARK_GREEN: '#708045',
  LIGHT_BROWN: '#B88C5A',
  PURPLE: '#A68AC1'
};

const DAILY_GOAL = 30; // TODO

const ProductivityProgress = ({ score }: { score: number; }) => {
  const percentage = Math.min((score / DAILY_GOAL), 1) * 100;
  const isComplete = (percentage === 100);
  const styles = {
    wrapper: {
      marginTop: 16
    },
    container: {
      // border: `1px solid ${colors.LIGHT_BROWN}`,
      border: `1px solid ${isComplete ? colors.BLACK : colors.LIGHT_BROWN}`,
      borderRadius: 4,
      marginBottom: 24,
      height: 8
    },
    bar: {
      height: '100%',
      width: `${percentage}%`,
      transition: 'width linear 1s',
      // backgroundColor: colors.ORANGE,
      backgroundColor: isComplete ? colors.BLUE : colors.ORANGE
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className='activity-labels-container'>
        <div className='activity-details-label text-heavy'>
          Today's Progress
        </div>

        <div className='activity-details-label'
          style={isComplete ? { fontWeight: 'bold', color: colors.BLUE } : {}}>
          {percentage.toFixed(0)}% Daily Goal
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.bar}></div>
      </div>
    </div>
  );
};

const HeatMap = ({ stats }: { stats: number[][] }) => {
  const weeks = 30;
  const days = weeks * 7;
  const scores = stats.map(([ts, score]) => score).sort((x, y) => x - y);
  const count = scores.filter(s => s > 0).length;
  const formatted = stats.map(([ts, score]) => {
    return { date: moment(ts).format(DATE_FORMAT), score };
  }).reverse();
  const streaks = getStreakStats(formatted);
  const min = first(scores);
  const max = last(scores);
  const mappedScores = stats.reduce((mappings, s) => {
    const [ts, score] = s;
    const date = moment(ts).format(DATE_FORMAT);

    return { ...mappings, [date]: score };
  }, {} as { [date: string]: number; });

  const scoresByDay = times(days, n => {
    const date = moment().subtract(n, 'days').format(DATE_FORMAT);
    const score = mappedScores[date] || 0;

    return { date, score };
  }).reverse();

  const scoresByWeek = chunk(scoresByDay, 7);
  const colors = ['#FBF6F0', '#F4E6DB', '#E6AF70', '#B88C5A'];
  const style = (score: number) => {
    if (score === 0) {
      return { backgroundColor: first(colors) };
    }
    // TODO: clean up
    const offset = max - min;
    const numerator = (score - min);
    const denominator =  (offset / 4);
    const index = Math.floor(numerator / denominator);
    const color = colors[index];

    return { backgroundColor: color };
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div className='activity-labels-container'>
        <div className='activity-details-label'>
          <span>Streak &mdash; </span>
          <span className='text-heavy'>{first(streaks)} days</span>
        </div>

        <div className='activity-details-label'>
          <span>Total Completed &mdash; </span>
          <span className='text-heavy'>{count} days</span>
        </div>
      </div>

      <div className='heat-map-container'>
        {
          times(7, index => {
            return (
              <div key={index} className='heat-row'>
                {
                  scoresByWeek.map(w => {
                    const { date, score } = w[index];

                    return (
                      <div
                        key={date}
                        className='heat-box'
                        style={style(score)}
                      />
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

const PastWeek = ({ stats }: { stats: number[][] }) => {
  const days = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
  const completed = stats.map(([ts, score]) => {
    const day = days[moment(ts).day()];

    return { day, score };
  });

  return (
    <div className='activity-past-week-container' style={{ marginBottom: 32 }}>
      <div className='activity-labels-container'>
        <div className='activity-details-label'>Past Week</div>

        <div className='activity-details-label text-heavy'>Today</div>
      </div>

      <div className='activity-past-week'>
        {
          completed.map(({ day, score }, key) => {
            const label = day.slice(0, 1).toUpperCase();
            const completed = score > 35 ? 'completed' : '';

            return (
              <div key={key}
                className={`activity-week-day ${day} ${completed}`}
                onMouseEnter={() => console.log(score)}>
                {label}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

interface PastWeekTableProps {
  depression: number[][];
  anxiety: number[][];
  wellbeing: number[][];
}

const PastWeekTable = ({
  depression,
  anxiety,
  wellbeing
}: PastWeekTableProps) => {
  // TODO: make sure dates line up with data
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const styles = {
    cell: { width: `${100 / 7}%` }
  };

  return (
    <div>
      <table className='activity-overview-table'
          style={{ marginTop: 32, marginBottom: 32 }}>
        <thead>
          <tr>
            {
              days.map((day, key) => {
                return <th key={key} style={styles.cell}>{day}</th>;
              })
            }
          </tr>
        </thead>
        <tbody>
          <tr className='activity-overview-row' style={{ color: colors.BLUE }}>
            {
              wellbeing.map(([ts, score]) => {
                const normalized = normalizeWellnessScore(score);

                return <td key={ts} style={styles.cell}>
                  {Math.round(score)}%
                </td>;
              })
            }
          </tr>

          <tr className='activity-overview-row' style={{ color: colors.RED }}>
            {
              anxiety.map(([ts, score]) => {
                return <td key={ts} style={styles.cell}>{score}%</td>;
              })
            }
          </tr>

          <tr className='activity-overview-row' style={{ color: colors.BLACK }}>
            {
              depression.map(([ts, score]) => {
                return <td key={ts} style={styles.cell}>{score}%</td>;
              })
            }
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface MoodDistributionProps {
  scores: {
    [label: string]: number;
  };
  label?: string;
}

interface MoodDistributionState {
  hovered: string;
}

class MoodDistributionChart extends React.Component<
  MoodDistributionProps,
  MoodDistributionState
> {
  constructor(props: MoodDistributionProps) {
    super(props);

    this.state = { hovered: null };
  }

  shouldComponentUpdate({ scores }: MoodDistributionProps) {
    return !isEqual(scores, this.props.scores);
  }

  render() {
    const { hovered } = this.state;
    const { scores } = this.props;
    const shades = [
      colors.LIGHT_BEIGE,
      colors.BEIGE,
      colors.ORANGE_BROWN,
      colors.LIGHT_BROWN,
      colors.BLACK
    ];
    const config = {
      title: {
        text: '',
      },
      chart: {
        type: 'pie',
        // height: 100,
        // width: 120,
        height: 120,
        width: 140,
        margin: [0, 0, 0, 0],
        style: {
          fontFamily: '"Quicksand", "Helvetica Neue", Arial, san-serif'
        }
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              // enabled: false,
              halo: false
            }
          },
          point: {
            events: {
              mouseOver: (e: any) => {
                this.setState({ hovered: e.target.name });
              },
              mouseOut: () => {
                this.setState({ hovered: null });
              }
            }
          },
          colors: shades
        }
      },
      credits: false,
      tooltip: { enabled: true, shadow: false },
      series: [
        // TODO: maybe try alternative approach to series data?
        // (see SeriesOption interface)
        {
          id: 'score',
          name: 'Score',
          data: keys(scores).map(label => {
            return [label, scores[label]];
          })
        }
      ]
    };

    // TODO: improve hover state, clean this up
    const getLegendColor = (name: string) => {
      return hovered === name ? colors.LIGHT_BROWN : colors.BLACK;
    };

    return (
      <div className='mood-score-chart-container'
        style={{ marginBottom: 16 }}>

        <div style={{ width: '40%', minWidth: 140 }}>
          <ReactHighcharts config={config} />
        </div>

        <div style={{}}>
          {
            keys(scores)
              .map((label, i) => {
                return { label, color: shades[i] };
              })
              .filter(({ label }) => scores[label] > 0)
              .map(({ label, color }, key) => {
                return (
                  <AnalyticsChartLabel
                    key={key}
                    color={color}
                    textColor={getLegendColor(label)}
                    label={label} />
                );
              })
          }
        </div>
      </div>
    );
  }
}

const MoodScoreIndicator = ({ score }: { score: number; }) => {
  const getWidth = (score?: number, n?: number) => {
    const SEGMENT = 0.25;
    const d = n * SEGMENT;
    const diff = score - d;

    if (diff >= 0) {
      return 1;
    } else if (Math.abs(diff) > SEGMENT) {
      return 0;
    } else {
      return (score - ((n - 1) * SEGMENT)) / SEGMENT;
    }
  };

  const getBackgroundColor = (n: number) => {
    if (n === 0) {
      return colors.WHITE;
    } else if (n === 100) {
      return colors.ORANGE;
    } else {
      const filled = `${colors.ORANGE} ${n}%`;
      const empty = `${colors.WHITE} ${n}%`;

      return `linear-gradient(90deg, ${filled}, ${empty})`;
    }
  };

  const getStyle = (score: number, n: number) => {
    const w = getWidth(score, n) * 100;
    const bg = getBackgroundColor(w);

    return { background: bg };
  };

  return (
    <div className='mood-score-indicator'>
      {
        times(5, n => {
          const style = getStyle(score, n);

          return <div key={n} className='mood-score-circle' style={style} />;
        })
      }
    </div>
  );
};

const AnalyticsChartLabel = ({ color, label, textColor }: {
  color: string;
  label: string;
  textColor?: string;
}) => {
  const textStyle = textColor ? { fontSize: 12, color: textColor } : { fontSize: 12 };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2  }}>
      <div style={{
        background: color,
        borderRadius: 4,
        height: 12,
        width: 16,
        marginRight: 8,
        marginLeft: 8
      }} />
      <div style={textStyle}>{label}</div>
    </div>
  );
};

interface ChartProps {
  activity: number[][];
  depression: number[][];
  anxiety: number[][];
  wellbeing: number[][];
}

class AnalyticsChart extends React.Component<ChartProps> {
  shouldComponentUpdate(nextProps: ChartProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { activity, depression, anxiety, wellbeing } = this.props;
    const config = {
      title: { text: '' },
      chart: {
        // height: 240,
        height: 320,
        style: {
          fontFamily: '"Quicksand", "Helvetica Neue", Arial, san-serif'
        }
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              mouseOver(e: any) {
                console.log(e, this);
              }
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        tickLength: 4,
        tickColor: colors.ORANGE,
        lineColor: colors.ORANGE,
        labels: {
          style: {
            color: colors.LIGHT_BROWN,
            fontSize: 10
          },
          y: 22,
          formatter() {
            return moment(this.value).format('MMM DD');
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineColor: colors.BEIGE,
        labels: {
          style: {
            color: colors.LIGHT_BROWN,
            fontSize: 10
          }
        },
        opposite: true
      },
      plotLines: {
        color: colors.LIGHT_BROWN
      },
      credits: false,
      series: [
        {
          id: 'scorecard',
          name: 'Productivity',
          color: colors.ORANGE,
          data: activity
        },
        {
          id: 'checklist',
          name: 'Depression',
          color: colors.BLACK,
          data: depression
        }, {
          id: 'anxiety',
          name: 'Anxiety',
          color: colors.RED,
          data: anxiety
        }, {
          id: 'wellbeing',
          name: 'Well-Being',
          color: colors.BLUE,
          data: wellbeing
        }
      ]
    };

    return (
      <div className='analytics-section-container'
        style={{ flex: 3, marginRight: 16 }}>
        <ReactHighcharts config={config} />

        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-around' }}>
          <AnalyticsChartLabel color={colors.BLUE} label='Well-Being' />

          <AnalyticsChartLabel color={colors.ORANGE} label='Activity Level' />

          <AnalyticsChartLabel color={colors.RED} label='Anxiety' />

          <AnalyticsChartLabel color={colors.BLACK} label='Depression' />
        </div>
      </div>
    );
  }
}

const CorrelationsTable = ({ stats }: { stats: CorrelationStats }) => {
  const { coefficients } = stats;
  const style = {
    container: { flex: 1, paddingTop: 16, paddingBottom: 16 },
    header: { marginTop: 0, fontSize: 18, paddingBottom: 4, marginBottom: 16 },
    label: { marginBottom: 4 },
    details: { marginBottom: 12 },
    score: { fontSize: 18, marginRight: 12, letterSpacing: 0.8 },
    description: { fontSize: 12 }
  };

  const formatLabel = (label: string) => {
    const mappings: { [key: string]: string } = {
      depression: 'Depression',
      anxiety: 'Anxiety',
      wellbeing: 'Well-being',
      productivity: 'Productivity'
    };

    return mappings[label];
  };

  const formatScore = (score: number) => {
    const prefix = score < 0 ? '' : '+';

    return `${prefix}${score.toFixed(2)}`;
  };

  const getCorrelationLevel = (score: number) => {
    const n = Math.abs(score);
    const direction = score < 0
      ? <span style={{ color: colors.RED }}>negative</span>
      : <span style={{ color: colors.BLUE }}>positive</span>;

    if (n < 0.1) {
      return <span>no correlation</span>;
    } else if (n >= 0.1 && n < 0.3) {
      return <span>low {direction} correlation</span>;
    } else if (n >= 0.3 && n < 0.5) {
      return <span>moderate {direction} correlation</span>;
    } else {
      return <span>strong {direction} correlation</span>;
    }
  };

  return (
    <div className='analytics-section-container'
      style={style.container}>
      <h4 className='text-heavy' style={style.header}>
        Correlation Scores
      </h4>

      {
        keys(coefficients)
          .sort((x, y) => {
            const scoreX = coefficients[x];
            const scoreY = coefficients[y];

            return Math.abs(scoreY) - Math.abs(scoreX);
          })
          .map((pair, key) => {
            const score = coefficients[pair];
            const [label1, label2] = pair.split(':').map(formatLabel);

            return (
              <div key={key}>
                <div className='activity-details-label text-med'
                  style={style.label}>
                  {label1} <span className='text-heavy'>:</span> {label2}
                </div>

                <div style={style.details}>
                  <span className='text-heavy' style={style.score}>
                    {formatScore(score)}
                  </span>
                  <span style={style.description}>
                    {getCorrelationLevel(score)}
                  </span>
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

interface SectionAverageProps {
  averages: {
    today?: number;
    thisWeek?: number;
    thisMonth?: number;
    lastWeek?: number;
    lastMonth?: number;
  };
}

// TODO: figure out how to make this look nicer
const SectionAverages = ({ averages }: SectionAverageProps) => {
  const {
    today = 0,
    thisWeek = 0,
    lastWeek = 0,
    thisMonth = 0,
    lastMonth = 0
  } = averages;

  return (
    <div style={{ marginTop: 16, marginLeft: 16 }}>
      <div style={{ display: 'flex' }}>
        {/* TODO: use bar graph to denote scores? */}
        <div style={{ width: '40%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className='vertical-bar-container'>
              <div className='vertical-bar' style={{ height: `${today.toFixed(3)}%` }}></div>
            </div>

            {/* TODO: use overall average score for analytics (not today's) */}
            <div style={{ fontSize: 54, fontWeight: 500 }}>
              <span>{(today || 0).toFixed(0)}</span><span style={{ fontSize: 32 }}>%</span>
            </div>
          </div>

          <div style={{ fontSize: 10, color: '#B88C5A' }}>overall average</div>
        </div>

        <div style={{
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ marginBottom: 8, marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {(thisWeek || 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>this week</div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {(thisMonth || 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>this month</div>
          </div>
        </div>

        <div style={{
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ marginBottom: 8, marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: colors.DARK_GREEN, fontWeight: 900 }}>
                {thisWeek >= lastWeek ? '+' : '-'}
              </span>
              <span>{Math.abs(thisWeek - lastWeek).toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>from last week</div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: colors.DARK_GREEN, fontWeight: 900 }}>
                {thisMonth >= lastMonth ? '+' : '-'}
              </span>
              <span>{Math.abs(thisMonth - lastMonth).toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MoodTableProps {
  issues: {
    text: string;
    score: number;
  }[];
  suggestions: {
    label: string;
    tasks: {
      id: number;
      name: string;
      impact?: number;
    }[]
  };
}

const MoodSectionTable = ({ issues, suggestions }: MoodTableProps) => {
  const bgs = [colors.LIGHT_BEIGE, colors.BEIGE, colors.ORANGE];
  const { tasks } = suggestions;
  const combined = times(5, n => {
    const issue = issues[n];
    const task = tasks[n];

    if (!issue || !task) return null;

    const { name, impact } = task;
    const { text, score } = issue;

    return {
      issueName: text,
      issueScore: score * 100,
      taskName: name,
      taskImpact: impact
    };
  }).filter(Boolean);

  const scores = combined.map(({ issueScore }) => issueScore);
  const impacts = combined.map(({ taskImpact }) => taskImpact);
  const averageScore = calculateAverage(scores);
  const averageImpact = calculateAverage(impacts);

  const getBgColor = (diff: number) => {
    if (diff < -1) {
      return colors.ORANGE;
    } else if (diff > 1) {
      return colors.LIGHT_BEIGE;
    } else {
      return colors.BEIGE;
    }
  };

  const styles = {
    text: { width: '35%' },
    num: { width: '15%' },
    score: (n?: number) => {
      if (!n) return styles.num;

      const diff = Math.abs(averageScore) - Math.abs(n);

      return {
        ...styles.num,
        backgroundColor: n ? getBgColor(diff) : null // FIXME
      };
    },
    impact: (n?: number) => {
      if (!n) return styles.num;

      const diff = Math.abs(averageImpact) - Math.abs(n);

      return {
        ...styles.num,
        backgroundColor: n ? getBgColor(diff) : null
      };
    }
  };

  return (
    <table className='analytics-table' style={{ marginBottom: 0 }}>
      <thead>
        <tr>
          <th className='text-left' style={styles.text}>Top Issues</th>
          <th style={styles.num}>Score</th>
          <th className='text-left' style={styles.text}>Top Suggestions</th>
          <th style={styles.num}>Impact</th>
        </tr>
      </thead>
      <tbody>
        {
          combined.map((data, key) => {
            const { issueName, issueScore, taskName, taskImpact } = data;

            return (
              <tr key={key}>
                <td className='text-left' style={styles.text}>{issueName}</td>
                <td className='-text-heavy' style={styles.score(issueScore)}>
                  {(issueScore || 0).toFixed(1)}%
                </td>
                <td className='text-left' style={styles.text}>
                  {taskName}
                </td>
                <td className='-text-heavy' style={styles.impact(taskImpact)}>
                  {(taskImpact || 0).toFixed(1)}%
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

interface AnalyticsSectionProps {
  title: string;
  moodDistribution: {
    [label: string]: number;
  };
  averages: {
    today?: number;
    thisWeek?: number;
    thisMonth?: number;
    lastWeek?: number;
    lastMonth?: number;
  };
  topIssues: {
    text: string;
    score: number;
  }[];
  suggestions: {
    label: string;
    tasks: {
      id: number;
      name: string;
      impact?: number;
    }[]
  };
}

const AnalyticsSection = ({
  title,
  moodDistribution,
  averages,
  topIssues,
  suggestions
}: AnalyticsSectionProps) => {
  return (
    <section>
      <h2 style={{ marginBottom: 16 }}>
        {title}
      </h2>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className='analytics-section-container'
          style={{ flex: 1, maxWidth: 360, marginRight: 16 }}>
          <MoodDistributionChart
            scores={moodDistribution}
            label={title.toLowerCase()} />

          <SectionAverages averages={averages} />
        </div>

        <div className='analytics-section-container'
          style={{ display: 'flex', flex: 2, paddingTop: 16, paddingBottom: 16 }}>
          <MoodSectionTable
            issues={topIssues}
            suggestions={suggestions} />
        </div>
      </div>
    </section>
  );
};

const formatTaskStats = (stats: TaskAssessmentStats[]) => {
  return stats.map(stat => {
    const { task, count, stats } = stat;
    const { description, category } = task;
    const name = `${category}: ${description}`;
    const { depression, anxiety, wellbeing } = stats;
    const {
      included: dIncluded,
      excluded: dExcluded,
      delta: dDelta
    } = depression;
    const {
      included: aIncluded,
      excluded: aExcluded,
      delta: aDelta
    } = anxiety;
    const {
      included: _wIncluded,
      excluded: _wExcluded,
      delta: _wDelta
    } = wellbeing;
    const wIncluded = normalizeWellnessScore(_wIncluded);
    const wExcluded = normalizeWellnessScore(_wExcluded);
    const wDelta = normalizeWellnessScore(_wDelta);

    const happiness = calculateHappiness({
      depression: dIncluded,
      anxiety: aIncluded,
      wellness: wIncluded
    });

    const exHappiness = calculateHappiness({
      depression: dExcluded,
      anxiety: aExcluded,
      wellness: wExcluded
    });

    const hDelta = happiness - exHappiness;

    return {
      name,
      count,
      percentages: {
        happiness,
        depression: dIncluded,
        anxiety: aIncluded,
        wellness: wIncluded
      },
      deltas: {
        depression: dDelta,
        anxiety: aDelta,
        wellness: wDelta,
        happiness: hDelta
      }
    };
  });
};

interface TaskReportingTableProps {
  stats: TaskAssessmentStats[];
}

// TODO: allow sorting by:
// - overall depression/anxiety/wellness/happiness
// - impact on depression/anxiety/wellness/happiness
// TODO: add client-side pagination
const TaskReportingTable = ({ stats }: TaskReportingTableProps) => {
  const POSITIVE = 1;
  const NEGATIVE = -1;
  const formatted = formatTaskStats(stats);
  const styles = {
    container: { paddingTop: 16, paddingBottom: 16 },
    table: { marginBottom: 0 },
    delta: { marginLeft: 4 },
    lg: { width: '25%' },
    sm: { width: '15%' }
  };

  const getDeltaSymbol = (n: number) => {
    return n > 0 ? '+' : '';
  };

  const renderDelta = (delta: number, direction: number = POSITIVE) => {
    if (isNumber(delta)) {
      const s = {
        color: (delta * direction) > 0 ? colors.BLUE : colors.RED
      };

      return (
        <span style={styles.delta}>
          (<span style={s}>{getDeltaSymbol(delta)}{delta.toFixed(1)}%</span>)
        </span>
      );
    } else {
      return <span></span>;
    }
  };

  return (
    <div className='analytics-section-container' style={styles.container}>
      <table className='analytics-table' style={styles.table}>
        <thead>
          <tr>
            <th className='text-left' style={styles.lg}>Task</th>
            <th style={styles.sm}>Count</th>
            <th style={styles.sm}>Depression</th>
            <th style={styles.sm}>Anxiety</th>
            <th style={styles.sm}>Wellness</th>
            <th style={styles.sm}>Happiness</th>
          </tr>
        </thead>
        <tbody>
          {formatted
            .sort((x, y) => {
              // return y.percentages.happiness - x.percentages.happiness;
              return y.deltas.happiness - x.deltas.happiness;
              // return y.deltas.wellness - x.deltas.wellness;
              // return x.deltas.anxiety - y.deltas.anxiety;
              // return x.deltas.depression - y.deltas.depression;
            })
            .slice(0, 10)
            .map((stat, key) => {
              const { name, count, percentages, deltas } = stat;
              const { depression, anxiety, wellness, happiness } = percentages;
              const {
                depression: dDelta,
                anxiety: aDelta,
                wellness: wDelta,
                happiness: hDelta
              } = deltas;

              return (
                <tr key={key} className='analytics-row'>
                  <td className='text-left' style={styles.lg}>{name}</td>
                  <td style={styles.sm}>{count} time{count === 1 ? '' : 's'}</td>
                  <td style={styles.sm}>
                    {isNumber(depression) ? `${depression.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(dDelta, NEGATIVE)}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(anxiety) ? `${anxiety.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(aDelta, NEGATIVE)}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(wellness) ? `${wellness.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(wDelta, POSITIVE)}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(happiness) ? `${happiness.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(hDelta, POSITIVE)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const getPastMonths = (months = 12, today = moment()) => {
  const current = moment(today).month();

  return times(months, n => {
    const next = current - n;
    const m = next < 0 ? 12 + next : next;

    return moment().month(m).format('MMMM');
  }).reverse();
};

const mapMonthToAverage = (stats: MonthlyAverage[] = []) => {
  return stats.reduce((result, s) => {
    const { month, average } = s;

    return { ...result, [month]: average };
  }, {} as { [month: string]: number; });
};

interface MonthlyAverageRowProps {
  label: string;
  months: string[];
  averages: { [month: string]: number; };
  color?: string;
}

const MonthlyAverageRow = ({
  label,
  months,
  averages,
  color
}: MonthlyAverageRowProps) => {
  const styles = {
    cell: { fontSize: 12, width: '7%', color: color || colors.BLACK },
  };

  return (
    <tr className='analytics-row'>
      <td className='text-right'>{label}</td>
      {
        months.map(month => {
          const score = averages[month];

          return (
            <td key={month} style={styles.cell}>
              {isNumber(score) ? score.toFixed(1) : '--'}
            </td>
          );
        })
      }
    </tr>
  );
};

const MonthlyAveragesTable = ({ stats }: { stats: MonthlyAverageStats }) => {
  const months = getPastMonths();
  const { productivity, depression, anxiety, wellbeing } = stats;
  const p = mapMonthToAverage(productivity);
  const d = mapMonthToAverage(depression);
  const a = mapMonthToAverage(anxiety);
  const w = mapMonthToAverage(wellbeing);
  const styles = {
    container: { paddingTop: 16, paddingBottom: 16 },
    table: { marginBottom: 0 },
    cell: { fontSize: 12, width: '7%' },
  };

  return (
    <div className='analytics-section-container' style={styles.container}>
      <table className='analytics-table' style={styles.table}>
        <thead>
          <tr>
            <th className='text-right'>Type</th>
            {
              months.map(month => {
                return (
                  <th key={month} style={styles.cell}>{month.slice(0, 3)}</th>
                );
              })
            }
          </tr>
        </thead>
        <tbody>
          <MonthlyAverageRow
            label='Productivity'
            months={months}
            averages={p}
            color={colors.ORANGE} />

          <MonthlyAverageRow
            label='Depression'
            months={months}
            averages={d}
            color={colors.BLACK} />

          <MonthlyAverageRow
            label='Anxiety'
            months={months}
            averages={a}
            color={colors.RED} />

          <MonthlyAverageRow
            label='Well-being'
            months={months}
            averages={w}
            color={colors.BLUE} />
        </tbody>
      </table>
    </div>
  );
};

interface ContainerProps {}

interface ContainerState {
  stats: ReportingStats;
}

class AnalyticsContainer extends React.Component<
  ContainerProps,
  ContainerState
> {
  constructor(props: ContainerProps) {
    super(props);

    this.state = {
      stats: {} as ReportingStats
    };
  }

  componentDidMount() {
    const today = moment().format(DATE_FORMAT);
    const range = {
      startDate: moment().subtract(6, 'months').format(DATE_FORMAT),
      endDate: today
    };
    console.time('Fetch');

    return all([
      fetchAllStats(range),
      fetchWeekStats(today),
      fetchMonthStats(today),
      fetchTaskStats(range),
      fetchMonthlyAverages()
    ])
      .then(([allStats, weekStats, monthStats, taskStats, monthlyAverages]) => {
        console.timeEnd('Fetch');
        const stats = {
          ...allStats,
          weekStats,
          monthStats,
          taskStats,
          monthlyAverages
        };

        return this.setState({ stats });
      })
      .catch(err => console.log('Error fetching stats!', err));
  }

  mergeWeekAndMonthStats(weekStats: any, monthStats: any) {
    if (isEmpty(weekStats || isEmpty(monthStats))) {
      return {
        wellbeing: {},
        anxiety: {},
        depression: {},
        productivity: {}
      };
    }

    const {
      assessmentStats: weekAssessments,
      scorecardStats: weekScorecards
    } = weekStats;
    const {
      assessmentStats: monthAssessments,
      scorecardStats: monthScorecards
    } = monthStats;
    const {
      today: todayAssessments,
      thisWeek: thisWeekAssessments,
      lastWeek: lastWeekAssessments
    } = weekAssessments;
    const {
      today: todayScorecards,
      thisWeek: thisWeekScorecards,
      lastWeek: lastWeekScorecards
    } = weekScorecards;
    const {
      thisMonth: thisMonthAssessments,
      lastMonth: lastMonthAssessments
    } = monthAssessments;
    const {
      thisMonth: thisMonthScorecards,
      lastMonth: lastMonthScorecards
    } = monthScorecards;

    return {
      wellbeing: {
        today: todayAssessments.wellbeing,
        thisWeek: thisWeekAssessments.wellbeing,
        thisMonth: thisMonthAssessments.wellbeing,
        lastWeek: lastWeekAssessments.wellbeing,
        lastMonth: lastMonthAssessments.wellbeing,
      },
      anxiety: {
        today: todayAssessments.anxiety,
        thisWeek: thisWeekAssessments.anxiety,
        thisMonth: thisMonthAssessments.anxiety,
        lastWeek: lastWeekAssessments.anxiety,
        lastMonth: lastMonthAssessments.anxiety,
      },
      depression: {
        today: todayAssessments.depression,
        thisWeek: thisWeekAssessments.depression,
        thisMonth: thisMonthAssessments.depression,
        lastWeek: lastWeekAssessments.depression,
        lastMonth: lastMonthAssessments.depression,
      },
      productivity: {
        today: todayScorecards,
        thisWeek: thisWeekScorecards,
        thisMonth: thisMonthScorecards,
        lastWeek: lastWeekScorecards,
        lastMonth: lastMonthScorecards
      }
    };
  }

  render() {
    const { stats } = this.state;
    const {
      scorecardStats = [],
      assessmentStats = {},

      wellnessLevelFrequency,
      anxietyLevelFrequency,
      depressionLevelFrequency,

      wellnessQuestionStats = [],
      anxietyQuestionStats = [],
      depressionQuestionStats = [],

      weekStats = {},
      monthStats = {},
      taskStats = [],
      monthlyAverages = {} as MonthlyAverageStats,

      correlationStats = {} as CorrelationStats
    } = stats;

    console.log(taskStats);

    const { wellbeing = [], anxiety = [], depression = [] } = assessmentStats;
    const wellBeingIssues = wellnessQuestionStats.slice().reverse();
    const averages = this.mergeWeekAndMonthStats(weekStats, monthStats);

    const getStatScore = ([t, score]: number[]) => score;

    const depressionScores = depression.map(getStatScore);
    const anxietyScores = anxiety.map(getStatScore);
    const wellBeingScores = wellbeing.map(getStatScore);
    const averageDepression = calculateAverage(depressionScores);
    const averageAnxiety = calculateAverage(anxietyScores);
    // TODO: remove the need to "normalizeWellnessScore"
    const averageWellBeing = normalizeWellnessScore(
      calculateAverage(wellBeingScores)
    );

    const formattedTaskStats = formatTaskStats(taskStats);
    const highImpactTasksAnxiety = formattedTaskStats
      .filter(stat => stat.percentages.anxiety > 0)
      .sort((x, y) => x.deltas.anxiety - y.deltas.anxiety);

    const highImpactTasksDepression = formattedTaskStats
      .filter(stat => stat.percentages.depression > 0)
      .sort((x, y) => x.deltas.depression - y.deltas.depression);

    const highImpactTasksWellness = formattedTaskStats
      .filter(stat => stat.percentages.wellness > 0)
      .sort((x, y) => y.deltas.wellness - x.deltas.wellness);

    return (
      <div className='default-wrapper simple'>
        <NavBar active={'reports'} />

        <div className='default-container simple'>
          <div className='analytics-container'>
            <h1 style={{ marginBottom: 32 }}>
              Analytics
            </h1>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <AnalyticsChart
                activity={scorecardStats}
                depression={depression}
                anxiety={anxiety}
                wellbeing={wellbeing} />

              <CorrelationsTable stats={correlationStats} />
            </div>

            <MonthlyAveragesTable stats={monthlyAverages} />

            <h2>Activities</h2>

            <TaskReportingTable stats={taskStats} />

            <AnalyticsSection
              title='Well-being'
              moodDistribution={wellnessLevelFrequency}
              averages={{
                ...averages.wellbeing,
                today: averageWellBeing // TODO: clean up
              }}
              topIssues={
                wellBeingIssues
                  .slice(0, 5)
                  .map(({ question, average }) => {
                    const score = (average / 4);

                    return { score, text: question };
                  })
              }
              suggestions={{
                label: 'well-being',
                tasks: highImpactTasksWellness
                  .slice(0, 5)
                  .map(({ name, deltas }, index) => {
                    return { id: index, impact: deltas.wellness, name };
                  })
              }} />

            <AnalyticsSection
              title='Anxiety'
              moodDistribution={anxietyLevelFrequency}
              averages={{
                ...averages.anxiety,
                today: averageAnxiety // TODO: clean up
              }}
              topIssues={
                anxietyQuestionStats
                  .slice(0, 5)
                  .map(({ question, average }) => {
                    const score = (average / 4);

                    return { score, text: question };
                  })
              }
              suggestions={{
                label: 'anxiety',
                tasks: highImpactTasksAnxiety
                  .slice(0, 5)
                  .map(({ name, deltas }, index) => {
                    return { id: index, impact: deltas.anxiety, name };
                  })
              }} />

            <AnalyticsSection
              title='Depression'
              moodDistribution={depressionLevelFrequency}
              averages={{
                ...averages.depression,
                today: averageDepression // TODO: clean up
              }}
              topIssues={
                depressionQuestionStats
                  .slice(0, 5)
                  .map(({ question, average }) => {
                    const score = (average / 4);

                    return { score, text: question };
                  })
              }
              suggestions={{
                label: 'depression',
                tasks: highImpactTasksDepression
                  .slice(0, 5)
                  .map(({ name, deltas }, index) => {
                    return { id: index, impact: deltas.depression, name };
                  })
              }} />
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticsContainer;
