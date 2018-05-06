import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as moment from 'moment';
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
import { AppState, SelectedState, keyifyDate } from '../../helpers/utils';
import {
  getScorecardByDate,
  getChecklistByDate,
  getEntryByDate,
  getChallengesByDate,
  getMoodByDate,
  setMoodByDate,
  toggleTask,
  selectDate
} from '../../reducers';
import './Dashboard.less';

const mapStateToProps = (state: AppState) => {
  const today = keyifyDate(moment());
  const {
    selected,
    scorecards,
    checklists,
    entries,
    challenges,
    moods
  } = state;
  const { byDate: scorecardsByDate } = scorecards;
  const { byDate: checklistsByDate } = checklists;
  const { byDate: entriesByDate } = entries;
  const { byDate: challengeByDate } = challenges;
  const { byDate: moodsByDate } = moods;

  return {
    selected,
    scorecard: scorecardsByDate[today],
    checklist: checklistsByDate[today],
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
      dispatch(getEntryByDate(today)),
      dispatch(getChallengesByDate(today)),
      dispatch(getMoodByDate(today))
    ])
      .then(() => {
        const { scorecard, checklist, entry, mood } = this.props;

        return dispatch(selectDate({
          scorecard,
          checklist,
          entry,
          mood,
          date
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
