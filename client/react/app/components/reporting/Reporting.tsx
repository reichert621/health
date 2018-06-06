import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import NavBar from '../navbar';
import ReportingChart from './ReportingChart';
import ReportingOverview from './ReportingOverview';
import ReportingAverages from './ReportingAverages';
import ScoresByAbility from './ScoresByAbility';
import TopTasks from './TopTasks';
import MoodFrequency from './MoodFrequency';
import ScoresByDay from './ScoresByDay';
import TopMoods from './TopMoods';
import HighImpactTasks from './HighImpactTasks';
import { ReportingStats } from '../../helpers/reporting';
import { AppState } from '../../helpers/utils';
import { getAllStats } from '../../reducers/stats';
import './Reporting.less';

const mapStateToProps = (state: AppState) => {
  const { stats = {} as ReportingStats } = state;

  return { stats };
};

interface ReportingProps extends RouteComponentProps<{}> {
  stats: ReportingStats;
  dispatch: Dispatch<any>;
}

class Reporting extends React.Component<ReportingProps> {
  componentDidMount() {
    return this.props.dispatch(getAllStats());
  }

  render() {
    const { history, stats } = this.props;
    const {
      // Checklist stats
      checklistStats = [],
      completedChecklists = [],
      checklistScoresByDay = {},
      depressionLevelFrequency = {},
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
      assessmentStats = {}
    } = stats;

    const highImpactTasks = checklistScoresByTask.slice(0, 5);
    const lowImpactTasks = checklistScoresByTask.length > 5
      ? checklistScoresByTask.slice(-5).reverse()
      : [];

    console.log('stats!', stats);

    return (
      <div>
        <NavBar
          title='Analytics'
          linkTo='/today'
          history={history} />

        <div className='default-container'>
          <div className='reporting-header-container reporting-component'>
            <ReportingOverview
              checklists={completedChecklists}
              scorecards={completedScorecards}
              tasks={topTasks} />
          </div>

          <div className='clearfix'>
            <div className='reporting-sidebar-container reporting-component pull-left'>
              <h4>Daily Averages</h4>

              <ScoresByDay
                checklistScores={checklistScoresByDay}
                scorecardScores={scorecardScoresByDay} />
            </div>

            <div className='reporting-graph-container reporting-component pull-right'>
              <ReportingChart
                checklistStats={checklistStats}
                scorecardStats={scorecardStats}
                assessmentStats={assessmentStats} />
            </div>
          </div>

          <div className='clearfix'>
            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Overall</h4>

              <ReportingAverages
                checklistStats={checklistStats}
                scorecardStats={scorecardStats} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Common Issues</h4>

              <TopMoods stats={checklistQuestionStats} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Mood Frequency</h4>

              <MoodFrequency stats={depressionLevelFrequency} />
            </div>
          </div>

          <div className='clearfix'>
            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Favorite Tasks</h4>

              <TopTasks tasks={topTasks} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>High-Impact Tasks</h4>

              <HighImpactTasks tasks={highImpactTasks} />
            </div>

            <div className='reporting-component-container reporting-component pull-left'>
              <h4>Low-Impact Tasks</h4>

              <HighImpactTasks tasks={lowImpactTasks} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Reporting);
