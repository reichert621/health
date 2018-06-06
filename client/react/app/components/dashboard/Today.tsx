import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as moment from 'moment';
import { values } from 'lodash';
import { all, resolve } from 'bluebird';
import NavBar from '../navbar';
import TodayProgressBar from './TodayProgressBar';
import DashboardPreview from './DashboardPreview';
import Scorecard from '../scorecard/Scorecard';
import {
  IScorecard,
  createNewScorecard,
  fetchProgressToday
} from '../../helpers/scorecard';
import { IChecklist, createNewChecklist } from '../../helpers/checklist';
import { Entry, createEntry } from '../../helpers/entries';
import { Task, calculateScore } from '../../helpers/tasks';
import { IChallenge, toggleChallengeByDate } from '../../helpers/challenges';
import { IMood } from '../../helpers/mood';
import {
  IAssessment,
  AssessmentType,
  createAssessment,
  fetchAssessmentsByDate
} from '../../helpers/assessment';
import { AppState, SelectedState, keyifyDate } from '../../helpers/utils';
import { selectDate } from '../../reducers/selected';
import { getScorecardByDate, toggleTask } from '../../reducers/scorecards';
import { getChecklistByDate } from '../../reducers/checklists';
import { getChallengesByDate } from '../../reducers/challenges';
import { getEntryByDate } from '../../reducers/entries';
import { getAssessmentsByDate } from '../../reducers/assessments';
import { getMoodByDate, setMoodByDate } from '../../reducers/moods';
import './Dashboard.less';

const mapStateToProps = (state: AppState) => {
  const today = keyifyDate(moment());
  const {
    selected,
    scorecards,
    checklists,
    assessments,
    entries,
    challenges,
    moods
  } = state;
  const { byDate: scorecardsByDate } = scorecards;
  const { byDate: checklistsByDate } = checklists;
  const { byDate: assessmentsByDate } = assessments;
  const { byDate: entriesByDate } = entries;
  const { byDate: challengeByDate } = challenges;
  const { byDate: moodsByDate } = moods;

  return {
    selected,
    scorecard: scorecardsByDate[today],
    checklist: checklistsByDate[today],
    assessments: assessmentsByDate[today],
    entry: entriesByDate[today],
    challenges: challengeByDate[today],
    mood: moodsByDate[today]
  };
};

interface TodayProps extends RouteComponentProps<{}> {
  selected: SelectedState;
  scorecard: IScorecard;
  checklist: IChecklist;
  entry: Entry;
  mood: IMood;
  challenges: IChallenge[];
  assessments: { [type: string]: IAssessment };
  dispatch: Dispatch<any|Promise<any>>;
}

interface TodayState {
  isLoading: boolean;
  averageScore?: number;
  topScore?: number;
}

class Today extends React.Component<TodayProps, TodayState> {
  constructor(props: TodayProps) {
    super(props);

    this.state = {
      isLoading: true,
      averageScore: 0,
      topScore: 0
    };
  }

  componentDidMount() {
    // TODO: this is a temporary hack to make sure this page scrolls
    // to the top after a scorecard or a checklist is submitted
    window.scrollTo(0, 0);

    const { history, dispatch } = this.props;
    const date = moment();
    const today = date.format('YYYY-MM-DD');

    return all([
      dispatch(getScorecardByDate(today)),
      dispatch(getChecklistByDate(today)),
      dispatch(getEntryByDate(today))
    ])
      .then(() => {
        return all([
          dispatch(getChallengesByDate(today)),
          dispatch(getMoodByDate(today)),
          dispatch(getAssessmentsByDate(today))
        ]);
      })
      .then(() => {
        const { scorecard, checklist, entry, mood, assessments } = this.props;

        return dispatch(selectDate({
          scorecard,
          checklist,
          entry,
          mood,
          date,
          assessments
        }));
      })
      .then(() => fetchProgressToday())
      .then(scores => {
        const { average, top } = scores;

        return this.setState({
          isLoading: false,
          averageScore: average,
          topScore: top
        });
      })
      .catch(err => {
        if (err.status === 401) {
          return history.push('/login');
        }

        return console.log('Error fetching dashboard!', err);
      });
  }

  createNewScorecard(scorecard: IScorecard, date: moment.Moment) {
    if (scorecard && scorecard.id) return resolve();

    const { history } = this.props;
    // TODO: deal with timezone bug (inconsistency with db and client)
    const params = { date: date.format('YYYY-MM-DD') };

    return createNewScorecard(params)
      .then(({ id: scorecardId }) => {
        return history.push(`/scorecard/${scorecardId}`);
      });
  }

  createNewChecklist(checklist: IChecklist, date: moment.Moment) {
    if (checklist && checklist.id) return resolve();

    const { history } = this.props;
    const params = { date: date.format('YYYY-MM-DD') };

    return createNewChecklist(params)
      .then(({ id: checklistId }) => {
        return history.push(`/checklist/${checklistId}`);
      });
  }

  createNewAssessment(
    assessment: IAssessment,
    date: moment.Moment,
    type: AssessmentType
  ) {
    if (assessment && assessment.id) return resolve();

    const { history } = this.props;
    const params = { type, date: date.format('YYYY-MM-DD') };

    return createAssessment(params)
      .then(({ id: assessmentId }) => {
        return history.push(`/assessment/${assessmentId}`);
      })
      .catch(err => {
        console.log('Error creating assessment!', err);
      });
  }

  createNewEntry(entry: Entry, date: moment.Moment) {
    if (entry && entry.id) return resolve();

    const { history } = this.props;
    const params = {
      date: date.format('YYYY-MM-DD'),
      title: date.format('YYYY-MM-DD'),
      content: '',
      isPrivate: true
    };

    return createEntry(params)
      .then(({ id: entryId }) => {
        return history.push(`/entry/${entryId}`);
      });
  }

  handleTaskUpdate(task: Task) {
    const { scorecard = {} as IScorecard, dispatch } = this.props;

    return dispatch(toggleTask(scorecard, task));
  }

  handleChallengeUpdate(challenge: IChallenge) {
    const { dispatch } = this.props;
    const { id: challengeId, isComplete: isCurrentlyComplete } = challenge;
    const isComplete = !isCurrentlyComplete;
    const today = moment().format('YYYY-MM-DD');

    // TODO: handle in redux better
    return toggleChallengeByDate(challengeId, today, isComplete)
      .then(() => {
        return dispatch(getChallengesByDate(today));
      });
  }

  handleMoodSelected(mood: IMood) {
    const { dispatch } = this.props;
    const { id: moodId } = mood;
    const today = moment().format('YYYY-MM-DD');

    return dispatch(setMoodByDate(today, moodId))
      .catch(err => {
        console.log('Error updating mood!');
      });
  }

  render() {
    const { isLoading, averageScore, topScore } = this.state;
    const {
      history,
      scorecard = {} as IScorecard,
      selected = {} as SelectedState,
      mood = {} as IMood,
      challenges = []
    } = this.props;
    const { tasks = [] } = scorecard;
    const currentScore = calculateScore(tasks);

    if (isLoading) {
      // TODO: handle loading state better
    }

    return (
      <div>
        <NavBar
          title='Welcome!'
          history={history} />

        <div className='default-container'>
          <div className='clearfix'>
            <div className='dashboard-preview-container pull-left'>
              <DashboardPreview
                isLoading={isLoading}
                selected={selected}
                handleMoodSelected={this.handleMoodSelected.bind(this)}
                handleScorecardClicked={this.createNewScorecard.bind(this)}
                handleChecklistClicked={this.createNewChecklist.bind(this)}
                handleAssessmentClicked={this.createNewAssessment.bind(this)}
                handleEntryClicked={this.createNewEntry.bind(this)} />
            </div>

            <div className='dashboard-scorecard-container pull-right'>
              <TodayProgressBar
                currentScore={currentScore}
                averageScore={averageScore}
                topScore={topScore} />

              <Scorecard
                tasks={tasks}
                challenges={challenges}
                handleTaskUpdate={this.handleTaskUpdate.bind(this)}
                handleChallengeUpdate={this.handleChallengeUpdate.bind(this)}
                isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Today);
