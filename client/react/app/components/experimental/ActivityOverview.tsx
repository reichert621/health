import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import * as moment from 'moment';
import {
  times,
  chunk,
  keys,
  includes,
  isEqual,
  isEmpty,
  first,
  last
} from 'lodash';
import { all } from 'bluebird';
import styled from 'styled-components';
import { Box, Label, Container, FlexContainer } from './Common';
import DatePicker from './DatePicker';
import { DATE_FORMAT, getStreakStats } from '../../helpers/utils';
import {
  ReportingStats,
  fetchAllStats,
  fetchWeekStats,
  fetchMonthStats,
  normalizeWellnessScore
} from '../../helpers/reporting';

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

interface ProductivityProps {
  isComplete: boolean;
  percentage?: number;
}

const ProgressLabel = styled(Label)`
  color: ${(props: ProductivityProps) =>
    props.isComplete ? colors.BLUE : colors.LIGHT_BROWN};
`;

// const ProductivityWrapper = styled.div`
//   margin-top: 16px;
// `;

const ProductivityContainer = styled.div`
  border: 1px solid
    ${(props: ProductivityProps) =>
      props.isComplete ? colors.BLUE : colors.LIGHT_BROWN};
  border-radius: 4px;
  margin-bottom: 24px;
  height: 8px;
`;

const ProductivityBar = styled.div`
  height: 100%;
  width: ${(props: ProductivityProps) => props.percentage}%;
  transition: width linear 1s;
  opacity: ${(props: ProductivityProps) => (props.isComplete ? 0.8 : 1)};
  background-color: ${(props: ProductivityProps) =>
    props.isComplete ? colors.BLUE : colors.ORANGE};
`;

const ProductivityProgress = ({ score }: { score: number }) => {
  const percentage = Math.min(score / DAILY_GOAL, 1) * 100;
  const isComplete = percentage === 100;

  return (
    <Box mt={16}>
      <div className="activity-labels-container">
        <Label heavy>Today's Progress</Label>

        <ProgressLabel isComplete={isComplete} heavy={isComplete}>
          {percentage.toFixed(0)}% Daily Goal
        </ProgressLabel>
      </div>

      <ProductivityContainer isComplete={isComplete}>
        <ProductivityBar isComplete={isComplete} percentage={percentage} />
      </ProductivityContainer>
    </Box>
  );
};

const HeatMap = ({ date, stats }: { date: string; stats: number[][] }) => {
  const weeks = 30;
  const days = weeks * 7;
  const scores = stats.map(([ts, score]) => score).sort((x, y) => x - y);
  const count = scores.filter(s => s > 0).length;
  const formatted = stats
    .filter(([ts, score]) => score > 0)
    .map(([ts, score]) => {
      return { date: moment(ts).format(DATE_FORMAT), score };
    })
    .reverse();

  const streaks = getStreakStats(formatted);
  const currentStreak = first(streaks);
  const min = first(scores);
  const max = last(scores);
  const mappedScores = stats.reduce(
    (mappings, s) => {
      const [ts, score] = s;
      const date = moment(ts).format(DATE_FORMAT);

      return { ...mappings, [date]: score };
    },
    {} as { [date: string]: number }
  );

  const scoresByDay = times(days, n => {
    const _date = moment(date)
      .subtract(n, 'days')
      .format(DATE_FORMAT);
    const score = mappedScores[_date] || 0;

    return { score, date: _date };
  }).reverse();

  const scoresByWeek = chunk(scoresByDay, 7);
  const colors = ['#FBF6F0', '#F4E6DB', '#E6AF70', '#B88C5A'];
  const style = (score: number) => {
    if (score === 0) {
      return { backgroundColor: first(colors) };
    }
    // TODO: clean up
    const offset = max - min;
    const numerator = score - min;
    const denominator = offset / 4;
    const index = Math.floor(numerator / denominator);
    const color = colors[index];

    return { backgroundColor: color };
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="activity-labels-container">
        <div className="activity-details-label">
          <span>Streak &mdash; </span>
          <span className="text-heavy">
            {currentStreak} day{currentStreak === 1 ? '' : 's'}
          </span>
        </div>

        <div className="activity-details-label">
          <span>Total Completed &mdash; </span>
          <span className="text-heavy">
            {count} day{count === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="heat-map-container">
        {times(7, index => {
          return (
            <div key={index} className="heat-row">
              {scoresByWeek.map(w => {
                const { date, score } = w[index];

                return (
                  <div key={date} className="heat-box" style={style(score)} />
                );
              })}
            </div>
          );
        })}
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
    <div className="activity-past-week-container" style={{ marginBottom: 32 }}>
      <div className="activity-labels-container">
        <div className="activity-details-label">Past Week</div>

        <div className="activity-details-label text-heavy">Today</div>
      </div>

      <div className="activity-past-week">
        {completed.map(({ day, score }, key) => {
          const label = day.slice(0, 1).toUpperCase();
          const completed = score > 15 ? 'completed' : '';

          return (
            <div
              key={key}
              className={`activity-week-day ${day} ${completed}`}
              onMouseEnter={() => console.log(score)}
            >
              {label}
            </div>
          );
        })}
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
  // const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = times(7, n => {
    return moment()
      .subtract(n, 'days')
      .format('dd'); // .slice(0, 1);
  }).reverse();

  const styles = {
    cell: { width: `${100 / 7}%` }
  };

  return (
    <div>
      <table
        className="activity-overview-table"
        style={{ marginTop: 32, marginBottom: 32 }}
      >
        <thead>
          <tr>
            {days.map((day, key) => {
              return (
                <th key={key} style={styles.cell}>
                  {day}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="activity-overview-row" style={{ color: colors.BLUE }}>
            {wellbeing.map(([ts, score]) => {
              const normalized = normalizeWellnessScore(score);

              return (
                <td key={ts} style={styles.cell}>
                  {score ? `${Math.round(score)}%` : '--'}
                </td>
              );
            })}
          </tr>

          <tr className="activity-overview-row" style={{ color: colors.RED }}>
            {anxiety.map(([ts, score]) => {
              return (
                <td key={ts} style={styles.cell}>
                  {score ? `${Math.round(score)}%` : '--'}
                </td>
              );
            })}
          </tr>

          <tr className="activity-overview-row" style={{ color: colors.BLACK }}>
            {depression.map(([ts, score]) => {
              return (
                <td key={ts} style={styles.cell}>
                  {score ? `${Math.round(score)}%` : '--'}
                </td>
              );
            })}
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
        text: ''
      },
      chart: {
        type: 'pie',
        height: 100,
        width: 120,
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
      <div
        className="mood-score-chart-container"
        style={{ marginTop: 32, marginBottom: 32 }}
      >
        <div style={{ width: '40%', minWidth: 120 }}>
          <ReactHighcharts config={config} />
        </div>

        <div style={{}}>
          {keys(scores)
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
                  label={label}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

const MoodScoreIndicator = ({ score }: { score: number }) => {
  const getWidth = (score?: number, n?: number) => {
    const SEGMENT = 0.25;
    const d = n * SEGMENT;
    const diff = score - d;

    if (diff >= 0) {
      return 1;
    } else if (Math.abs(diff) > SEGMENT) {
      return 0;
    } else {
      return (score - (n - 1) * SEGMENT) / SEGMENT;
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
    <div className="mood-score-indicator">
      {times(5, n => {
        const style = getStyle(score, n);

        return <div key={n} className="mood-score-circle" style={style} />;
      })}
    </div>
  );
};

const AnalyticsChartLabel = ({
  color,
  label,
  textColor
}: {
  color: string;
  label: string;
  textColor?: string;
}) => {
  const textStyle = textColor
    ? { fontSize: 12, color: textColor }
    : { fontSize: 12 };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
      <div
        style={{
          background: color,
          borderRadius: 4,
          height: 12,
          width: 16,
          marginRight: 8,
          marginLeft: 8
        }}
      />
      <div style={textStyle}>{label}</div>
    </div>
  );
};

interface ChartPreviewProps {
  activity: number[][];
  depression: number[][];
  anxiety: number[][];
  wellbeing: number[][];
}

class AnalyticsChartPreview extends React.Component<ChartPreviewProps> {
  shouldComponentUpdate(nextProps: ChartPreviewProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { activity, depression, anxiety, wellbeing } = this.props;
    const config = {
      title: { text: '' },
      chart: {
        height: 240,
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
        },
        {
          id: 'anxiety',
          name: 'Anxiety',
          color: colors.RED,
          data: anxiety
        },
        {
          id: 'wellbeing',
          name: 'Well-Being',
          color: colors.BLUE,
          data: wellbeing
        }
      ]
    };

    return (
      <div style={{ marginTop: 16, marginBottom: 32 }}>
        <ReactHighcharts config={config} />

        <div
          style={{
            marginTop: 8,
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <div>
            <AnalyticsChartLabel color={colors.BLUE} label="Well-Being" />

            <AnalyticsChartLabel color={colors.ORANGE} label="Activity Level" />
          </div>

          <div>
            <AnalyticsChartLabel color={colors.RED} label="Anxiety" />

            <AnalyticsChartLabel color={colors.BLACK} label="Depression" />
          </div>
        </div>
      </div>
    );
  }
}

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
    <div style={{ marginBottom: 32, marginTop: 32 }}>
      <FlexContainer>
        {/* TODO: use bar graph to denote scores? */}
        <Container w="40%">
          <FlexContainer alignItems="center">
            <div className="vertical-bar-container">
              <div
                className="vertical-bar"
                style={{ height: `${(today || 0).toFixed(3)}%` }}
              />
            </div>

            <div style={{ fontSize: 54, fontWeight: 500 }}>
              <span>{(today || 0).toFixed(0)}</span>
              <span style={{ fontSize: 32 }}>%</span>
            </div>
          </FlexContainer>

          <div style={{ fontSize: 10, color: '#B88C5A' }}>today's score</div>
        </Container>

        <div
          style={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box mb={8} mt={8}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {(thisWeek || 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>
              average this week
            </div>
          </Box>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {(thisMonth || 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>
              average this month
            </div>
          </div>
        </div>

        <div
          style={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box mb={8} mt={8}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: colors.DARK_GREEN, fontWeight: 900 }}>
                {thisWeek >= lastWeek ? '+' : '-'}
              </span>
              <span>{Math.abs(thisWeek - lastWeek).toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>from last week</div>
          </Box>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: colors.DARK_GREEN, fontWeight: 900 }}>
                {thisMonth >= lastMonth ? '+' : '-'}
              </span>
              <span>{Math.abs(thisMonth - lastMonth).toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>
              from last month
            </div>
          </div>
        </div>
      </FlexContainer>
    </div>
  );
};

interface SectionTopIssueProps {
  issues: {
    text: string;
    score: number;
  }[];
}

// TODO: figure out how to make this look nicer
const SectionTopIssues = ({ issues }: SectionTopIssueProps) => {
  return (
    <div style={{ fontSize: 14 }}>
      <div className="activity-details-label">Top Issues</div>

      <ol style={{ paddingLeft: 16, paddingRight: 16 }}>
        {issues.map((issue, key) => {
          const { text, score } = issue;

          return (
            <li key={key}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ width: '65%' }}>{text}</span>
                <MoodScoreIndicator score={score} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

interface SectionSuggestionProps {
  suggestions: {
    label: string;
    tasks: {
      id: number;
      name: string;
    }[];
  };
}

// TODO: figure out how to make this look nicer
const SectionSuggestions = ({ suggestions }: SectionSuggestionProps) => {
  const { label, tasks } = suggestions;

  return (
    <div style={{ marginTop: 32, marginBottom: 32 }}>
      <div className="activity-details-label">
        <span>To improve </span>
        <span className="text-heavy">{label}:</span>
      </div>

      <ul
        style={{
          padding: '0 8px',
          listStyle: 'none',
          fontSize: 14,
          marginBottom: 16
        }}
      >
        {tasks.map(task => {
          const { id, name } = task;

          // TODO: add a way to "pin" or "favorite" these tasks for the day
          return (
            <li
              key={id}
              className="text-heavy"
              style={{ color: '#80A0C0', marginBottom: 4 }}
            >
              {name}
            </li>
          );
        })}
      </ul>
    </div>
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
    }[];
  };
}

const AnalyticsSectionPreview = ({
  title,
  moodDistribution,
  averages,
  topIssues,
  suggestions
}: AnalyticsSectionProps) => {
  return (
    <section>
      <h2 style={{ marginBottom: 16, marginTop: 32 }}>{title}</h2>

      <MoodDistributionChart
        scores={moodDistribution}
        label={title.toLowerCase()}
      />

      <SectionAverages averages={averages} />

      <SectionTopIssues issues={topIssues} />

      <SectionSuggestions suggestions={suggestions} />
    </section>
  );
};

interface ContainerProps {
  date: string;
}

interface ContainerState {
  stats: ReportingStats;
}

class AnalyticsPreviewContainer extends React.Component<
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
    const { date } = this.props;
    const endDate = moment(date).format(DATE_FORMAT);
    const range = {
      endDate,
      startDate: moment(date)
        .subtract(6, 'months')
        .format(DATE_FORMAT)
    };

    return all([
      fetchAllStats(range),
      fetchWeekStats(endDate),
      fetchMonthStats(endDate)
    ])
      .then(([allStats, weekStats, monthStats]) => {
        const stats = { ...allStats, weekStats, monthStats };

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
        lastMonth: lastMonthAssessments.wellbeing
      },
      anxiety: {
        today: todayAssessments.anxiety,
        thisWeek: thisWeekAssessments.anxiety,
        thisMonth: thisMonthAssessments.anxiety,
        lastWeek: lastWeekAssessments.anxiety,
        lastMonth: lastMonthAssessments.anxiety
      },
      depression: {
        today: todayAssessments.depression,
        thisWeek: thisWeekAssessments.depression,
        thisMonth: thisMonthAssessments.depression,
        lastWeek: lastWeekAssessments.depression,
        lastMonth: lastMonthAssessments.depression
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

  getPastWeekStats(stats: number[][]) {
    const { date } = this.props;
    const pastWeekDates = times(7, n => {
      return moment(date)
        .subtract(n, 'days')
        .format(DATE_FORMAT);
    }).reverse();

    const mappings = stats.slice(-7).reduce(
      (acc, [ts, score]) => {
        const date = moment.utc(ts).format(DATE_FORMAT);

        return { ...acc, [date]: score };
      },
      {} as { [date: string]: number }
    );

    return pastWeekDates.map(date => {
      const ts = moment(date).valueOf();
      const score = mappings[date] || null;

      return [ts, score];
    });
  }

  render() {
    const { stats } = this.state;
    const { date } = this.props;
    const title = moment(date).format('MMMM DD, YYYY');
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

      anxietyScoresByTask = [],
      depressionScoresByTask = [],
      wellnessScoresByTask = []
    } = stats;

    const { wellbeing = [], anxiety = [], depression = [] } = assessmentStats;
    const wellBeingIssues = wellnessQuestionStats.slice().reverse();
    const averages = this.mergeWeekAndMonthStats(weekStats, monthStats);
    const { today = 0 } = averages.productivity; // FIXME

    // FIXME! (See AnalyticsContainer)

    // TODO: create better algorithm to determine suggested tasks
    const highImpactTasksAnxiety = anxietyScoresByTask.slice(0, 3);
    const highImpactTasksDepression = depressionScoresByTask.slice(0, 3);
    // TODO: this is getting hacky, handle it somewhere else!
    const highImpactTasksWellness = wellnessScoresByTask
      .slice(0, 3)
      .reverse()
      .map(({ task, data }) => {
        const { average } = data;
        // This is done because wellness assessments are out of 80 points
        const normalized = (average / 80) * 100;

        return { task, data: { ...data, average: normalized } };
      });

    return (
      <div className="activity-details-container">
        <h2 style={{ marginBottom: 16 }}>{title || 'Overview'}</h2>

        {/* <DatePicker /> */}

        <ProductivityProgress score={today} />

        <HeatMap date={date} stats={scorecardStats} />

        {/*
          TODO: instead of just taking the last 7 items,
          make sure the dates match!
        */}
        <PastWeek stats={this.getPastWeekStats(scorecardStats)} />

        <AnalyticsChartPreview
          activity={this.getPastWeekStats(scorecardStats)}
          depression={this.getPastWeekStats(depression)}
          anxiety={this.getPastWeekStats(anxiety)}
          wellbeing={this.getPastWeekStats(wellbeing)}
        />

        {/* TODO: might be better to just remove this */}
        <PastWeekTable
          depression={this.getPastWeekStats(depression)}
          anxiety={this.getPastWeekStats(anxiety)}
          wellbeing={this.getPastWeekStats(wellbeing)}
        />

        <AnalyticsSectionPreview
          title="Well-being"
          moodDistribution={wellnessLevelFrequency}
          averages={averages.wellbeing}
          topIssues={wellBeingIssues
            .slice(0, 3)
            .map(({ question, average }) => {
              const score = average / 4;

              return { score, text: question };
            })}
          suggestions={{
            label: 'well-being',
            tasks: highImpactTasksWellness.map(({ task }, index) => {
              return { id: index, name: task };
            })
          }}
        />

        <AnalyticsSectionPreview
          title="Anxiety"
          moodDistribution={anxietyLevelFrequency}
          averages={averages.anxiety}
          topIssues={anxietyQuestionStats
            .slice(0, 3)
            .map(({ question, average }) => {
              const score = average / 4;

              return { score, text: question };
            })}
          suggestions={{
            label: 'anxiety',
            tasks: highImpactTasksAnxiety.map(({ task }, index) => {
              return { id: index, name: task };
            })
          }}
        />

        <AnalyticsSectionPreview
          title="Depression"
          moodDistribution={depressionLevelFrequency}
          averages={averages.depression}
          topIssues={depressionQuestionStats
            .slice(0, 3)
            .map(({ question, average }) => {
              const score = average / 4;

              return { score, text: question };
            })}
          suggestions={{
            label: 'depression',
            tasks: highImpactTasksDepression.map(({ task }, index) => {
              return { id: index, name: task };
            })
          }}
        />
      </div>
    );
  }
}

export default AnalyticsPreviewContainer;
