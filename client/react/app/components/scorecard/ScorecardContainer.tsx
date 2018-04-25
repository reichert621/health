import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import NavBar from '../navbar';
import ScorecardOverview from './ScorecardOverview';
import Scorecard from './Scorecard';
import { Task } from '../../helpers/tasks';
import { IScorecard } from '../../helpers/scorecard';
import { AppState, isDateToday } from '../../helpers/utils';
import { getScorecard, toggleTask } from '../../reducers';
import './Scorecard.less';

interface ScorecardContainerProps {
  date: moment.Moment;
  scorecard: IScorecard;
  tasks: Task[];
  dispatch: (action: any) => Promise<any>;
}

interface ScorecardContainerState {
  isSaving: boolean;
}

const mapStateToProps = (state: AppState) => {
  const { selected, scorecards } = state;
  const {
    date = moment(),
    scorecard: selectedScorecard = {} as IScorecard
  } = selected;
  const { byId: scorecardsById } = scorecards;
  const { id: scorecardId } = selectedScorecard;
  const scorecard = scorecardsById[scorecardId] || {} as IScorecard;
  const { tasks = [] } = scorecard;

  return {
    date,
    scorecard,
    tasks
  };
};

class ScorecardContainer extends React.Component<
  ScorecardContainerProps & RouteComponentProps<{ id: number }>,
  ScorecardContainerState
  > {
  constructor(props: ScorecardContainerProps & RouteComponentProps<{ id: number }>) {
    super(props);

    this.state = {
      isSaving: false
    };
  }

  componentDidMount() {
    const { match, history, dispatch } = this.props;
    const { id } = match.params;

    // In redux, cache only tasks where `isActive` is true,
    // and sanitize irrelevant fields (like `isComplete`)
    return dispatch(getScorecard(id))
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching scorecard!', err);
      });
  }

  handleTaskUpdate(task: Task) {
    const { scorecard, dispatch } = this.props;

    this.setState({ isSaving: true });

    return dispatch(toggleTask(scorecard, task))
      .then(() => {
        const delay = 1400;

        setTimeout(() => this.setState({ isSaving: false }), delay);
      });
  }

  render() {
    const { isSaving } = this.state;
    const { date, history, tasks = [] } = this.props;
    const completed = tasks.filter(t => t.isComplete);
    const isToday = isDateToday(date);
    const url = isToday ? '/today' : '/dashboard';

    return (
      <div>
        <NavBar
          title='Scorecard'
          linkTo={url}
          history={history} />

        <div className='default-container'>
          <h3 className='text-light'>
            {date.format('dddd MMMM DD, YYYY')}
          </h3>

          <div className='clearfix'>
            <div className='scorecard-container pull-left'>
              <Scorecard
                tasks={tasks}
                handleTaskUpdate={this.handleTaskUpdate.bind(this)} />
            </div>

            <div className='scorecard-overview-container pull-right'>
              <ScorecardOverview tasks={completed} />
            </div>
          </div>

          <div className='scorecard-footer clearfix'>
            <Link to={url}>
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
      </div>
    );
  }
}

export default connect(mapStateToProps)(ScorecardContainer);
