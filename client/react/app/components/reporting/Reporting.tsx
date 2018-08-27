import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { all } from 'bluebird';
import NavBar from '../navbar';
import ReportingChart from './ReportingChart';
import ReportingAverages from './ReportingAverages';
import CorrelationCoefficients from './CorrelationCoefficients';
import TopTasks from './TopTasks';
import MoodFrequency from './MoodFrequency';
import ScoresByDay from './ScoresByDay';
import TopMoods from './TopMoods';
import HighImpactTasks from './HighImpactTasks';
import ThisWeek from './ThisWeek';
import MonthlyAveragesTable from './MonthlyAveragesTable';
import { ReportingStats, CorrelationStats } from '../../helpers/reporting';
import { AppState, getDefaultDateRange } from '../../helpers/utils';
import {
  getAllStats,
  getWeekStats,
  getMonthlyAverages
} from '../../reducers/stats';
import './Reporting.less';

const mapStateToProps = (state: AppState) => {
  const { stats = {} as ReportingStats } = state;

  return { stats };
};

interface ReportingProps extends RouteComponentProps<{}> {
  stats: ReportingStats;
  dispatch: Dispatch<any>;
}

interface ReportingState {
  startDate: string;
  endDate: string;
}

class Reporting extends React.Component<ReportingProps, ReportingState> {
  constructor(props: ReportingProps) {
    super(props);

    const query = props.location.search;
    const { startDate, endDate } = getDefaultDateRange(query);

    this.state = {
      startDate,
      endDate,
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;

    return all([
      this.props.dispatch(getAllStats({ startDate, endDate })),
      this.props.dispatch(getWeekStats()),
      this.props.dispatch(getMonthlyAverages())
    ]);
  }

  render() {
    const { history, stats } = this.props;
    const {
      // Checklist stats
      checklistStats = [],
      completedChecklists = [],
      checklistScoresByDay = {},
      checklistQuestionStats = [],
      checklistScoresByTask = [],
      // Scorecard stats
      scorecardStats = [],
      completedScorecards = [],
      scorecardScoresByDay = {},
      totalScoreOverTime = [],
      taskAbilityStats = {},
      // Task stats
      topTasks = [],
      // Assessment stats
      assessmentStats = {},
      // Assessments - Depression
      completedDepressionAssessments = [],
      depressionScoresByDay = {},
      depressionLevelFrequency = {},
      depressionQuestionStats = [],
      depressionScoresByTask = [],
      // Assessments - Anxiety
      completedAnxietyAssessments = [],
      anxietyScoresByDay = {},
      anxietyLevelFrequency = {},
      anxietyQuestionStats = [],
      anxietyScoresByTask = [],
      // Assessments - Wellness
      completedWellnessAssessments = [],
      wellnessScoresByDay = {},
      wellnessLevelFrequency = {},
      wellnessQuestionStats = [],
      wellnessScoresByTask = [],
      // Week stats
      weekStats = {},
      monthlyAverages = {},
      // Correlation coefficients
      correlationStats = {} as CorrelationStats
    } = stats;

    const wellBeingIssues = wellnessQuestionStats.slice().reverse();
    // TODO: check that the data with these stats is accurate...
    const highImpactTasksAnxiety = anxietyScoresByTask.slice(0, 5);
    const highImpactTasksDepression = depressionScoresByTask.slice(0, 5);
    // TODO: this is getting hacky, handle it somewhere else!
    const highImpactTasksWellness = wellnessScoresByTask.slice(0, 5)
      .reverse()
      .map(({ task, data }) => {
        const { average } = data;
        // This is done because wellness assessments are out of 80 points
        const normalized = (average / 80) * 100;

        return { task, data: { ...data, average: normalized } };
      });

    console.log('stats!', stats);

    return (
      <div>
        <NavBar
          title='Analytics'
          linkTo='/today'
          history={history} />

        <div className='default-container'>
          <div className='reporting-header-container reporting-component'>
            <ThisWeek stats={weekStats} />
          </div>

          <div className='clearfix'>
            <div className='reporting-sidebar-container reporting-component pull-left'>
              <h4>Daily Averages</h4>

              <ScoresByDay
                scorecardScores={scorecardScoresByDay}
                depressionScores={depressionScoresByDay}
                anxietyScores={anxietyScoresByDay}
                wellnessScores={wellnessScoresByDay} />
            </div>

            <div className='reporting-graph-container reporting-component pull-right'>
              <ReportingChart
                checklistStats={checklistStats}
                scorecardStats={scorecardStats}
                assessmentStats={assessmentStats} />
            </div>
          </div>

          <div className='reporting-header-container reporting-component'>
            <h4>Monthly Averages</h4>

            <MonthlyAveragesTable stats={monthlyAverages} />
          </div>

          <div className='clearfix'>
            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Overall</h4>

              <ReportingAverages
                scorecardStats={scorecardStats}
                assessmentStats={assessmentStats} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Favorite Tasks</h4>

              <TopTasks tasks={topTasks} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Correlation Coefficients</h4>

              <CorrelationCoefficients stats={correlationStats} />
            </div>
          </div>

          <div className='clearfix'>
            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Well-being Issues</h4>

              <TopMoods stats={wellBeingIssues} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Wellness Frequency</h4>

              <MoodFrequency stats={wellnessLevelFrequency} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>High-Impact Tasks</h4>

              <HighImpactTasks
                label='well-being'
                tasks={highImpactTasksWellness} />
            </div>
          </div>

          <div className='clearfix'>
            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Depression Issues</h4>

              <TopMoods stats={checklistQuestionStats} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Depression Frequency</h4>

              <MoodFrequency stats={depressionLevelFrequency} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>High-Impact Tasks</h4>

              <HighImpactTasks
                label='depression'
                tasks={highImpactTasksDepression} />
            </div>
          </div>

          <div className='clearfix'>
            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Anxiety Issues</h4>

              <TopMoods stats={anxietyQuestionStats} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Anxiety Frequency</h4>

              <MoodFrequency stats={anxietyLevelFrequency} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>High-Impact Tasks</h4>

              <HighImpactTasks
                label='anxiety'
                tasks={highImpactTasksAnxiety} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Reporting);
