import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as moment from 'moment';
import NavBar from '../navbar';
import ScorecardOverview from './ScorecardOverview';
import Scorecard from './Scorecard';
import { Task, fetchDefaultTasks } from '../../helpers/tasks';
import { isDateToday } from '../../helpers/utils';
import { isAuthenticated } from '../../helpers/auth';
import './Scorecard.less';

const fetchSampleTasks = (): Promise<Task[]> => {
  return fetchDefaultTasks().then(tasks => {
    return tasks.map(t => {
      return { ...t, isComplete: false };
    });
  });
};

interface ScorecardSampleState {
  date: moment.Moment;
  tasks: Task[];
  isSaving: boolean;
}

class ScorecardSample extends React.Component<
  RouteComponentProps<{}>,
  ScorecardSampleState
  > {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      date: moment(),
      tasks: [],
      isSaving: false
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchSampleTasks()
      .then(tasks => {
        return this.setState({ tasks });
      })
      .catch(err => {
        console.log('Error fetching sample tasks!', err);
      });
  }

  handleTaskUpdate(task: Task) {
    const { category, description } = task;
    const { tasks = [] } = this.state;
    const updates = tasks.map(t => {
      if (t.category === category && t.description === description) {
        return { ...t, isComplete: !t.isComplete };
      }

      return t;
    });

    return this.setState({ tasks: updates });
  }

  done() {
    const { history } = this.props;

    return isAuthenticated()
      .then(isLoggedIn => {
        const next = isLoggedIn ? '/' : '/login';

        return history.push(next);
      })
      .catch(err => {
        console.log('Error checking authentication!', err);
      });
  }

  render() {
    const { isSaving, date, tasks = [] } = this.state;
    const { history } = this.props;
    const completed = tasks.filter(t => t.isComplete);

    return (
      <div>
        <NavBar
          title='Scorecard'
          history={history} />

        <div className='default-container'>
          <h3 className='text-light'>
            {date.format('dddd MMMM DD, YYYY')}
          </h3>

          <div className='clearfix'>
            <div className='scorecard-container pull-left'>
              <Scorecard
                tasks={tasks}
                challenges={[]}
                handleTaskUpdate={this.handleTaskUpdate.bind(this)} />
            </div>

            <div className='scorecard-overview-container pull-right'>
              <ScorecardOverview tasks={completed} />
            </div>
          </div>

          <div className='scorecard-footer clearfix'>
            <button className='btn-default pull-left'
              onClick={this.done.bind(this)}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ScorecardSample;
