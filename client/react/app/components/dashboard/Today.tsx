import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { all, resolve } from 'bluebird';
import NavBar from '../navbar';
import DashboardPreview from './DashboardPreview';
import Scorecard from '../scorecard/Scorecard';
import { IScorecard, createNewScorecard } from '../../helpers/scorecard';
import { IChecklist, createNewChecklist } from '../../helpers/checklist';
import { Entry, createEntry } from '../../helpers/entries';
import { Task } from '../../helpers/tasks';
import { AppState, SelectedState, keyifyDate } from '../../helpers/utils';
import {
  getScorecardByDate,
  getChecklistByDate,
  getEntryByDate,
  toggleTask
} from '../../reducers';
import './Dashboard.less';

const mapStateToProps = (state: AppState) => {
  const today = keyifyDate(moment());
  const { selected, scorecards, checklists, entries } = state;
  const { byDate: scorecardsByDate } = scorecards;
  const { byDate: checklistsByDate } = checklists;
  const { byDate: entriesByDate } = entries;

  return {
    selected,
    scorecard: scorecardsByDate[today],
    checklist: checklistsByDate[today],
    entry: entriesByDate[today]
  };
};

interface TodayProps extends RouteComponentProps<{}> {
  selected: SelectedState;
  scorecard: IScorecard;
  checklist: IChecklist;
  entry: Entry;
  dispatch: (action: any) => any;
}

interface TodayState {
  isLoading: boolean;
}

class Today extends React.Component<TodayProps, TodayState> {
  constructor(props: TodayProps) {
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
    const today = moment().format('YYYY-MM-DD');

    return all([
      dispatch(getScorecardByDate(today)),
      dispatch(getChecklistByDate(today)),
      dispatch(getEntryByDate(today))
    ])
      .then(() => this.setState({ isLoading: false }))
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

  render() {
    const { isLoading } = this.state;
    const {
      history,
      scorecard = {} as IScorecard,
      selected = {} as SelectedState,
    } = this.props;
    const { tasks = [] } = scorecard;

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
                selected={selected}
                handleScorecardClicked={this.createNewScorecard.bind(this)}
                handleChecklistClicked={this.createNewChecklist.bind(this)}
                handleEntryClicked={this.createNewEntry.bind(this)} />
            </div>

            <div className='dashboard-scorecard-container pull-right'>
              <Scorecard
                tasks={tasks}
                handleTaskUpdate={this.handleTaskUpdate.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Today);
