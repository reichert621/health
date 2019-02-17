import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as moment from 'moment';
import { IScorecard } from '../../helpers/scorecard';
import { Task } from '../../helpers/tasks';
import { AppState, keyifyDate, getDefaultDate } from '../../helpers/utils';
import { getScorecardByDate, toggleTask } from '../../reducers/scorecards';
import { selectDate } from '../../reducers/selected';
import ActivityList from './ActivityList';
import ActivityDetails from './ActivityDetails';
import ActivityOverview from './ActivityOverview';
import NavBar from '../navbar';
import './Activity.less';

const mapStateToProps = (state: AppState) => {
  const { scorecards, selected } = state;
  const { date } = selected;
  const { byDate: scorecardsByDate } = scorecards;
  const key = keyifyDate(date);

  return {
    scorecard: scorecardsByDate[key]
  };
};

interface ActivitiesContainerProps extends RouteComponentProps<{}> {
  scorecard: IScorecard;
  dispatch: Dispatch<any | Promise<any>>;
}

interface ActivitiesContainerState {
  date: string;
  selectedTaskId: number;
  isLoading: boolean;
}

class ActivitiesContainer extends React.Component<
  ActivitiesContainerProps,
  ActivitiesContainerState
> {
  constructor(props: ActivitiesContainerProps) {
    super(props);

    const query = props.location.search;
    const date = getDefaultDate(query);

    this.state = {
      date,
      selectedTaskId: null,
      isLoading: true
    };
  }

  componentDidMount() {
    // TODO: this is a temporary hack to make sure this page scrolls
    // to the top after a scorecard or a checklist is submitted
    window.scrollTo(0, 0);

    const { history, dispatch } = this.props;
    const { date } = this.state;

    dispatch(selectDate({ date: moment(date) }));

    return dispatch(getScorecardByDate(date))
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        if (err.status === 401) {
          return history.push('/login');
        }

        return console.log('Error fetching dashboard!', err);
      });
  }

  handleTaskToggled = (task: Task) => {
    const { scorecard = {} as IScorecard, dispatch } = this.props;

    return dispatch(toggleTask(scorecard, task));
  };

  handleTaskViewed = (task: Task) => {
    const { id: taskId } = task;

    return this.setState({ selectedTaskId: taskId });
  };

  renderSidePanel() {
    const { selectedTaskId, date } = this.state;

    return selectedTaskId ? (
      <ActivityDetails
        taskId={selectedTaskId}
        onClose={() => this.setState({ selectedTaskId: null })}
      />
    ) : (
      <ActivityOverview date={date} />
    );
  }

  render() {
    const { isLoading } = this.state;
    const { scorecard = {} as IScorecard } = this.props;
    const { tasks = [] } = scorecard;

    if (isLoading) {
      // TODO: handle loading state better
    }

    return (
      <div className="default-wrapper simple">
        <NavBar active={'activities'} />

        <div className="default-container simple">
          <ActivityList
            tasks={tasks}
            onToggleTask={this.handleTaskToggled}
            onViewTask={this.handleTaskViewed}
          />

          {this.renderSidePanel()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ActivitiesContainer);
