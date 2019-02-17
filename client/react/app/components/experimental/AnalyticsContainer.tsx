import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as moment from 'moment';
import { times, chunk, isEmpty, first, last } from 'lodash';
import { all } from 'bluebird';
import {
  DATE_FORMAT,
  getStreakStats,
  calculateAverage,
  getDefaultDateRange
} from '../../helpers/utils';
import {
  ReportingStats,
  CorrelationStats,
  MonthlyAverageStats,
  fetchAllStats,
  fetchWeekStats,
  fetchMonthStats,
  normalizeWellnessScore,
  fetchMonthlyAverages
} from '../../helpers/reporting';
import {
  formatTaskStats,
  fetchStats as fetchTaskStats
} from '../../helpers/tasks';
import colors from '../../helpers/colors';
import AnalyticsSection from './AnalyticsSection';
import MonthlyAveragesTable from './MonthlyAveragesTable';
import TaskReportingTable from './TaskReportingTable';
import AnalyticsChart from './AnalyticsChart';
import CorrelationsTable from './CorrelationsTable';
import NavBar from '../navbar';

const DAILY_GOAL = 30; // TODO

// TODO: check against other components
const ProductivityProgress = ({ score }: { score: number }) => {
  const percentage = Math.min(score / DAILY_GOAL, 1) * 100;
  const isComplete = percentage === 100;
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
      <div className="activity-labels-container">
        <div className="activity-details-label text-heavy">
          Today's Progress
        </div>

        <div
          className="activity-details-label"
          style={isComplete ? { fontWeight: 'bold', color: colors.BLUE } : {}}
        >
          {percentage.toFixed(0)}% Daily Goal
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.bar} />
      </div>
    </div>
  );
};

// TODO: check against other component
const HeatMap = ({ stats }: { stats: number[][] }) => {
  const weeks = 30;
  const days = weeks * 7;
  const scores = stats.map(([ts, score]) => score).sort((x, y) => x - y);
  const count = scores.filter(s => s > 0).length;
  const formatted = stats
    .map(([ts, score]) => {
      return { date: moment(ts).format(DATE_FORMAT), score };
    })
    .reverse();
  const streaks = getStreakStats(formatted);
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
    const date = moment()
      .subtract(n, 'days')
      .format(DATE_FORMAT);
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
          <span className="text-heavy">{first(streaks)} days</span>
        </div>

        <div className="activity-details-label">
          <span>Total Completed &mdash; </span>
          <span className="text-heavy">{count} days</span>
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

interface PastWeekTableProps {
  depression: number[][];
  anxiety: number[][];
  wellbeing: number[][];
}

// TODO: check against other component
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
                  {Math.round(score)}%
                </td>
              );
            })}
          </tr>

          <tr className="activity-overview-row" style={{ color: colors.RED }}>
            {anxiety.map(([ts, score]) => {
              return (
                <td key={ts} style={styles.cell}>
                  {score}%
                </td>
              );
            })}
          </tr>

          <tr className="activity-overview-row" style={{ color: colors.BLACK }}>
            {depression.map(([ts, score]) => {
              return (
                <td key={ts} style={styles.cell}>
                  {score}%
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

interface ContainerProps extends RouteComponentProps<{}> {}

interface ContainerState {
  startDate: string;
  endDate: string;
  stats: ReportingStats;
}

class AnalyticsContainer extends React.Component<
  ContainerProps,
  ContainerState
> {
  constructor(props: ContainerProps) {
    super(props);

    const query = props.location.search;
    const { startDate, endDate } = getDefaultDateRange(query);

    this.state = {
      startDate,
      endDate,
      stats: {} as ReportingStats
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;
    console.time('Fetch analytics stats');
    return all([
      fetchAllStats({ startDate, endDate }),
      fetchWeekStats(endDate),
      fetchMonthStats(endDate),
      fetchTaskStats({ startDate, endDate }),
      fetchMonthlyAverages()
    ])
      .then(([allStats, weekStats, monthStats, taskStats, monthlyAverages]) => {
        console.timeEnd('Fetch analytics stats');
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
      <div className="default-wrapper simple">
        <NavBar active={'reports'} />

        <div className="default-container simple">
          <div className="analytics-container">
            <h1 style={{ marginBottom: 32 }}>Analytics</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <AnalyticsChart
                activity={scorecardStats}
                depression={depression}
                anxiety={anxiety}
                wellbeing={wellbeing}
              />

              <CorrelationsTable stats={correlationStats} />
            </div>

            <MonthlyAveragesTable stats={monthlyAverages} />

            <h2>Activities</h2>

            <TaskReportingTable stats={taskStats} />

            <AnalyticsSection
              title="Well-being"
              moodDistribution={wellnessLevelFrequency}
              averages={{
                ...averages.wellbeing,
                today: averageWellBeing // TODO: clean up
              }}
              topIssues={wellBeingIssues
                .slice(0, 5)
                .map(({ question, average }) => {
                  const score = average / 4;

                  return { score, text: question };
                })}
              suggestions={{
                label: 'well-being',
                tasks: highImpactTasksWellness
                  .slice(0, 5)
                  .map(({ name, deltas }, index) => {
                    return { id: index, impact: deltas.wellness, name };
                  })
              }}
            />

            <AnalyticsSection
              title="Anxiety"
              moodDistribution={anxietyLevelFrequency}
              averages={{
                ...averages.anxiety,
                today: averageAnxiety // TODO: clean up
              }}
              topIssues={anxietyQuestionStats
                .slice(0, 5)
                .map(({ question, average }) => {
                  const score = average / 4;

                  return { score, text: question };
                })}
              suggestions={{
                label: 'anxiety',
                tasks: highImpactTasksAnxiety
                  .slice(0, 5)
                  .map(({ name, deltas }, index) => {
                    return { id: index, impact: deltas.anxiety, name };
                  })
              }}
            />

            <AnalyticsSection
              title="Depression"
              moodDistribution={depressionLevelFrequency}
              averages={{
                ...averages.depression,
                today: averageDepression // TODO: clean up
              }}
              topIssues={depressionQuestionStats
                .slice(0, 5)
                .map(({ question, average }) => {
                  const score = average / 4;

                  return { score, text: question };
                })}
              suggestions={{
                label: 'depression',
                tasks: highImpactTasksDepression
                  .slice(0, 5)
                  .map(({ name, deltas }, index) => {
                    return { id: index, impact: deltas.depression, name };
                  })
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticsContainer;
