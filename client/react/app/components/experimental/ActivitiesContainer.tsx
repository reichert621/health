import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as moment from 'moment';
import { all, resolve } from 'bluebird';
import { IScorecard } from '../../helpers/scorecard';
import { Task, calculateScore } from '../../helpers/tasks';
import { IMood } from '../../helpers/mood';
import {
  IAssessment,
  AssessmentType,
  createAssessment,
} from '../../helpers/assessment';
import { AppState, SelectedState, keyifyDate } from '../../helpers/utils';
import { selectDate } from '../../reducers/selected';
import { getScorecardByDate, toggleTask } from '../../reducers/scorecards';
import NavBar from '../navbar';
import ActivityCard from './ActivityCard';
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
  dispatch: Dispatch<any|Promise<any>>;
}

interface ActivitiesContainerState {
  isLoading: boolean;
}

class ActivitiesContainer extends React.Component<
  ActivitiesContainerProps,
  ActivitiesContainerState
> {
  constructor(props: ActivitiesContainerProps) {
    super(props);

    this.state = {
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
      .catch(err => {
        if (err.status === 401) {
          return history.push('/login');
        }

        return console.log('Error fetching dashboard!', err);
      });
  }

  handleTaskUpdate(task: Task) {
    const { scorecard = {} as IScorecard, dispatch } = this.props;

    return dispatch(toggleTask(scorecard, task));
  }

  render() {
    const { isLoading } = this.state;
    const {
      history,
      scorecard = {} as IScorecard
    } = this.props;
    const { tasks = [] } = scorecard;

    if (isLoading) {
      // TODO: handle loading state better
    }

    return (
      <div>
        <NavBar
          title='Activities'
          history={history} />

        <div className='default-container'>
          <div className='activities-container'>
            {
              tasks.map((task, key) => {
                return (
                  <ActivityCard
                    key={key}
                    task={task} />
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ActivitiesContainer);
