// NB: this is identical to Scorecard.tsx
// aside from some minor UI simplifications
import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { groupBy, keys, sortBy } from 'lodash';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../navbar';
import TaskCheckbox from './TaskCheckbox';
import ScorecardOverview from './ScorecardOverview';
import { Task, calculateScore } from '../../helpers/tasks';
import {
  IScorecard,
  fetchScorecard,
  updateScoreCard,
  toggleScorecardTask
} from '../../helpers/scorecard';
import { AppState, keyifyDate } from '../../helpers/utils';
import { getScorecard } from '../../reducers';
import './ScoreCard.less';

interface ScorecardProps {
  date: moment.Moment;
  scorecard: IScorecard;
  tasks: Task[];
  dispatch: (action: any) => any;
}

interface ScorecardState {
  scorecard: IScorecard;
  date: moment.Moment;
  tasks: Task[];
  isSaving: boolean;
}

const mapStateToProps = (state: AppState) => {
  const { selected, scorecards } = state;
  const { date, scorecard: selectedScorecard = {} as IScorecard } = selected;
  const { byId: scorecardsById } = scorecards;
  const { id: scorecardId } = selectedScorecard;
  const scorecard = scorecardsById[scorecardId] || {} as IScorecard;
  const { tasks } = scorecard;

  return {
    date,
    scorecard,
    tasks
  };
};

class ScoreCard extends React.Component<
  ScorecardProps & RouteComponentProps<{ id: number }>,
  ScorecardState
> {
  constructor(props: ScorecardProps & RouteComponentProps<{ id: number }>) {
    super(props);
    const {
      scorecard = {} as IScorecard,
      date = moment(),
      tasks = []
    } = this.props;

    this.state = {
      scorecard,
      date,
      tasks,
      isSaving: false
    };
  }

  componentDidMount() {
    const { match, history, dispatch } = this.props;
    const id = 168; // TODO! this is just for testing and only works locally!
    // const { id } = match.params;

    dispatch(getScorecard(id));
    // In redux, cache only tasks where `isActive` is true,
    // and sanitize irrelevant fields (like `isComplete`)
    return fetchScorecard(id)
      .then(scorecard => {
        const { tasks, date } = scorecard;

        return this.setState({ scorecard, tasks, date: moment(date) });
      })
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching scorecard!', err);
      });
  }

  handleCheckboxUpdate(task: Task) {
    const { tasks, scorecard } = this.state;
    const { id: scorecardId } = scorecard;
    const { id: taskId, isComplete: isCurrentlyComplete = false } = task;
    const isComplete = !isCurrentlyComplete;
    const update = tasks.map(t => {
      return t.id === taskId ? { ...t, isComplete } : t;
    });
    this.setState({ isSaving: true, tasks: update });
    return toggleScorecardTask(scorecardId, taskId, isComplete)
      .then(() => {
        const delay = 1400;

        setTimeout(() => this.setState({ isSaving: false }), delay);
      })
      .catch(err => {
        console.log('Error toggling task checkbox!', err);
        const revert = this.state.tasks.map(t => {
          return t.id === taskId
            ? { ...t, isComplete: isCurrentlyComplete }
            : t;
        });

        this.setState({ tasks: revert });
      });
  }

  handleDateChange(date: moment.Moment) {
    const { scorecard } = this.state;
    const { id: scorecardId } = scorecard;

    return updateScoreCard(scorecardId, { date })
      .then(scorecard => {
        this.setState({ date });
      })
      .catch(err => {
        console.log('Error updating date!', err);
      });
  }

  renderCheckboxes() {
    const { tasks } = this.state;
    const grouped = groupBy(tasks, 'category');
    const categories = keys(grouped);

    return categories.map((category, index) => {
      const subtasks = sortBy(grouped[category], t => -t.points);
      const score = calculateScore(subtasks);

      return (
        <div key={index}>
          <h4 className='category-label'>
            <span>{category}</span>
            <span className='score-details hidden'>(score: {score})</span>
          </h4>
          {
            subtasks.map((task, key) => {
              return (
                <TaskCheckbox
                  key={key}
                  task={task}
                  onToggle={this.handleCheckboxUpdate.bind(this, task)} />
              );
            })
          }
        </div>
      );
    });
  }

  render() {
    const { tasks, date, isSaving } = this.state;
    const { history } = this.props;
    const completed = tasks.filter(t => t.isComplete);

    return (
      <div style={{ marginTop: 16 }}>
        <div className='clearfix'>
          <div className='scorecard-container'
            style={{ borderTop: 'none', margin: '0 auto' }}>
            {this.renderCheckboxes()}
          </div>
        </div>

        <div className='scorecard-footer clearfix'>
          <Link to='/dashboard'>
            <button className='btn-default pull-left'>
              Done
            </button>
          </Link>

          <button className='btn-default btn-saving pull-right'>
            {isSaving ? 'Saving...' : 'Saved'}
            <img
              className={`saving-icon ${isSaving ? 'hidden' : ''}`}
              src='assets/check.svg' />
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ScoreCard);
