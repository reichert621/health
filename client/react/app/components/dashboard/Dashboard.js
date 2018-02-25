import React from 'react';
import { connect } from 'react-redux';
import { extend, values } from 'lodash';
import moment from 'moment';
import { all, resolve } from 'bluebird';
import NavBar from '../navbar';
import DashboardReporting from './DashboardReporting';
import DashboardList from './DashboardList';
import DashboardPreview from './DashboardPreview';
import { fetchScorecard, createNewScorecard } from '../../helpers/scorecard';
import { createNewChecklist } from '../../helpers/checklist';
import { createEntry } from '../../helpers/entries';
import { keyifyDate, getPastDates } from '../../helpers/utils';
import {
  LIST_VIEW,
  CHART_VIEW,
  UPDATE_VIEW,
  getScorecards,
  getChecklists,
  getEntries,
  selectDate
} from '../../reducers';
import './Dashboard.less';

const mapStateToProps = (state) => {
  const { currentView, selected, scorecards, checklists, entries } = state;
  const { byId: scorecardsById, byDate: scorecardsByDate } = scorecards;
  const { byId: checklistsById, byDate: checklistsByDate } = checklists;
  const { byId: entriesById, byDate: entriesByDate } = entries;

  return {
    currentView,
    selected,
    scorecardsByDate,
    checklistsByDate,
    entriesByDate,
    scorecards: values(scorecardsById),
    checklists: values(checklistsById),
    entries: values(entriesById)
  };
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      showChart: false
    };
  }

  componentDidMount() {
    // TODO: this is a temporary hack to make sure this page scrolls
    // to the top after a scorecard or a checklist is submitted
    window.scrollTo(0, 0);
    const { history, dispatch, selected = {} } = this.props;
    const { date = moment() } = selected;

    return all([
      dispatch(getScorecards()),
      dispatch(getChecklists()),
      dispatch(getEntries())
    ])
      .then(() => this.setState({ isLoading: false }))
      .then(() => this.handleDateSelected(date))
      .catch(err => {
        if (err.status === 401) {
          return history.push('/login');
        }

        return console.log('Error fetching dashboard!', err);
      });
  }

  handleDateSelected(date) {
    const { scorecardsByDate, checklistsByDate, entriesByDate } = this.props;
    const { dispatch } = this.props;
    const key = keyifyDate(date);
    const scorecard = scorecardsByDate[key];
    const checklist = checklistsByDate[key];
    const entry = entriesByDate[key];

    if (!scorecard) {
      return dispatch(selectDate({
        date,
        scorecard,
        checklist,
        entry
      }));
    }

    const { id: scorecardId } = scorecard;

    return fetchScorecard(scorecardId)
      .then(({ tasks = [] }) => {
        return dispatch(selectDate({
          date,
          checklist,
          entry,
          scorecard: extend(scorecard, { tasks })
        }));
      });
  }

  handlePointClicked(timestamp) {
    const date = moment.utc(timestamp);

    if (date.isValid()) {
      return this.handleDateSelected(date);
    } else {
      return false;
    }
  }

  createNewScorecard(scorecard, date) {
    if (scorecard && scorecard.id) return resolve();

    const { history } = this.props;
    // TODO: deal with timezone bug (inconsistency with db and client)
    const params = { date: date.format('YYYY-MM-DD') };

    return createNewScorecard(params)
      .then(({ id: scorecardId }) => {
        return history.push(`/scorecard/${scorecardId}`);
      });
  }

  createNewChecklist(checklist, date) {
    if (checklist && checklist.id) return resolve();

    const { history } = this.props;
    const params = { date: date.format('YYYY-MM-DD') };

    return createNewChecklist(params)
      .then(({ id: checklistId }) => {
        return history.push(`/checklist/${checklistId}`);
      });
  }

  createNewEntry(entry, date) {
    if (entry && entry.id) return resolve();

    const { history } = this.props;
    const params = {
      date: date.format('YYYY-MM-DD'),
      title: '',
      content: ''
    };

    return createEntry(params)
      .then(({ id: entryId }) => {
        return history.push(`/entry/${entryId}`);
      });
  }

  setCurrentView(view) {
    const { dispatch } = this.props;

    return dispatch({ view, type: UPDATE_VIEW });
  }

  render() {
    const dates = getPastDates();
    const { isLoading } = this.state;
    const {
      history,
      currentView,
      selected = {},
      scorecards = [],
      checklists = []
    } = this.props;
    const showChart = (currentView === CHART_VIEW);

    if (isLoading) {
      // TODO: handle loading state better
    }

    return (
      <div>
        <NavBar
          title="Dashboard"
          history={history} />

        <div className="default-container">
          <div className="clearfix">
            <div className="dashboard-preview-container pull-left">
              <DashboardPreview
                selected={selected}
                handleScorecardClicked={this.createNewScorecard.bind(this)}
                handleChecklistClicked={this.createNewChecklist.bind(this)}
                handleEntryClicked={this.createNewEntry.bind(this)} />
            </div>

            <div className="dashboard-list-container pull-right">
              <div className="toggle-btn-container">
                <button
                  className={`btn-default btn-toggle ${showChart ? '' : 'active'}`}
                  onClick={this.setCurrentView.bind(this, LIST_VIEW)}>
                  List
                </button>
                <button
                  className={`btn-default btn-toggle ${showChart ? 'active' : ''}`}
                  onClick={this.setCurrentView.bind(this, CHART_VIEW)}>
                  Chart
                </button>
              </div>
              {
                showChart ?
                  <DashboardReporting
                    onClickPoint={this.handlePointClicked.bind(this)}/> :
                  <DashboardList
                    dates={dates}
                    scorecards={scorecards}
                    checklists={checklists}
                    selected={selected}
                    handleDateSelected={this.handleDateSelected.bind(this)} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
