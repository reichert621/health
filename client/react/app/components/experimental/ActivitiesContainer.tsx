import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as moment from 'moment';
import { groupBy, keys } from 'lodash';
import { all, resolve } from 'bluebird';
import { IScorecard } from '../../helpers/scorecard';
import { Task, calculateScore } from '../../helpers/tasks';
import { IMood } from '../../helpers/mood';
import {
  IAssessment,
  AssessmentType,
  createAssessment
} from '../../helpers/assessment';
import { AppState, keyifyDate } from '../../helpers/utils';
import { getScorecardByDate, toggleTask } from '../../reducers/scorecards';
import ActivityCardSimple from './ActivityCardSimple';
import ActivityDetails from './ActivityDetails';
import ActivityOverview from './ActivityOverview';
import NavBar from '../navbar';
import './Activity.less';

const mapStateToProps = (state: AppState) => {
  const today = keyifyDate(moment());
  const { scorecards } = state;
  const { byDate: scorecardsByDate } = scorecards;

  return {
    scorecard: scorecardsByDate[today]
  };
};

interface ActivitiesContainerProps extends RouteComponentProps<{}> {
  scorecard: IScorecard;
  dispatch: Dispatch<any | Promise<any>>;
}

interface ActivitiesContainerState {
  selectedTaskId: number;
  isLoading: boolean;
}

class ActivitiesContainer extends React.Component<
  ActivitiesContainerProps,
  ActivitiesContainerState
> {
  constructor(props: ActivitiesContainerProps) {
    super(props);

    this.state = {
      selectedTaskId: null,
      isLoading: true
    };
  }

  componentDidMount() {
    // TODO: this is a temporary hack to make sure this page scrolls
    // to the top after a scorecard or a checklist is submitted
    window.scrollTo(0, 0);

    const { history, dispatch } = this.props;
    const date = moment();
    const today = date.format('YYYY-MM-DD');

    return dispatch(getScorecardByDate(today))
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        if (err.status === 401) {
          return history.push('/login');
        }

        return console.log('Error fetching dashboard!', err);
      });
  }

  handleTaskToggled(task: Task) {
    const { scorecard = {} as IScorecard, dispatch } = this.props;

    return dispatch(toggleTask(scorecard, task));
  }

  handleTaskViewed(task: Task) {
    const { id: taskId } = task;

    return this.setState({ selectedTaskId: taskId });
  }

  renderSidePanel() {
    const { selectedTaskId } = this.state;

    return selectedTaskId
      ? <ActivityDetails
          taskId={selectedTaskId}
          onClose={() => this.setState({ selectedTaskId: null })} />
      : <ActivityOverview />;
  }

  render() {
    const { isLoading } = this.state;
    const { scorecard = {} as IScorecard } = this.props;
    const { tasks = [] } = scorecard;
    const grouped = groupBy(tasks, 'category');

    if (isLoading) {
      // TODO: handle loading state better
    }

    return (
      <div className='default-wrapper simple'>
        <NavBar active={'activities'} />

        <div className='default-container simple'>
          <div className='activities-container-simple'>
            {keys(grouped).map(category => {
              const tasks = grouped[category];

              return (
                <div key={category}>
                  <div className='activities-label'>
                    {category}
                  </div>

                  {tasks.map((task, key) => {
                    return (
                      <ActivityCardSimple
                        key={key}
                        task={task}
                        onToggle={this.handleTaskToggled.bind(this, task)}
                        onView={this.handleTaskViewed.bind(this, task)} />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {this.renderSidePanel()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ActivitiesContainer);
