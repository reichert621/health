import React from 'react';
import { times, extend } from 'lodash';
import moment from 'moment';
import { all, resolve } from 'bluebird';
import DashboardReporting from './DashboardReporting';
import DashboardList from './DashboardList';
import DashboardPreview from './DashboardPreview';
import { fetchScorecards, fetchScorecard, createNewScorecard } from '../../helpers/scorecard';
import { fetchChecklists, createNewChecklist } from '../../helpers/checklist';
import { keyifyDate, mapByDate, getPastDates } from '../../helpers/utils';
import './Dashboard.less';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scorecards: [],
      checklists: [],
      selected: {}
    };
  }

  componentDidMount() {
    // TODO: this is a temporary hack to make sure this page scrolls
    // to the top after a scorecard or a checklist is submitted
    window.scrollTo(0, 0);
    const { history } = this.props;

    return all([
      fetchScorecards(),
      fetchChecklists()
    ])
      .then(([scorecards, checklists]) => {
        return this.setState({
          scorecards,
          checklists,
          scorecardsByDate: mapByDate(scorecards),
          checklistsByDate: mapByDate(checklists)
        });
      })
      .then(() => {
        const today = moment();

        return this.handleDateSelected(today);
      })
      .catch(err => {
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching dashboard!', err);
      });
  }

  handleDateSelected(date) {
    const { scorecardsByDate, checklistsByDate } = this.state;
    const key = keyifyDate(date);
    const scorecard = scorecardsByDate[key];
    const checklist = checklistsByDate[key];

    if (!scorecard) {
      return this.setState({
        selected: {
          date,
          scorecard,
          checklist
        }
      });
    }

    const { id: scorecardId } = scorecard;

    return fetchScorecard(scorecardId)
      .then(({ tasks = [] }) => {
        return this.setState({
          selected: {
            date,
            checklist,
            scorecard: extend(scorecard, { tasks })
          }
        });
      });
  }

  createNewScorecard(scorecard, date) {
    if (scorecard && scorecard.id) return resolve();

    const { history } = this.props;
    // TODO: temporary workaround to deal with timezone bug
    const params = { date: moment(date).startOf('day') };

    return createNewScorecard(params)
      .then(({ id: scorecardId }) => {
        console.log('Created scorecard!', scorecardId);
        return history.push(`/scorecard/${scorecardId}`);
      });
  }

  createNewChecklist(checklist, date) {
    if (checklist && checklist.id) return resolve();

    const { history } = this.props;
    const params = { date: moment(date).startOf('day') };

    return createNewChecklist(params)
      .then(({ id: checklistId }) => {
        console.log('Created checklist!', checklistId);
        return history.push(`/checklist/${checklistId}`);
      });
  }

  render() {
    const { scorecards = [], checklists = [], selected = {} } = this.state;
    const { date: selectedDate } = selected;
    const dates = getPastDates();

    return (
      <div className="default-container">
        <h1>Dashboard</h1>

        <div className="clearfix">
          <div className="dashboard-preview-container pull-left">
            <DashboardPreview
              selected={selected}
              handleScorecardClicked={this.createNewScorecard.bind(this)}
              handleChecklistClicked={this.createNewChecklist.bind(this)} />
          </div>

          <div className="dashboard-list-container pull-right">
            <DashboardList
              dates={dates}
              scorecards={scorecards}
              checklists={checklists}
              handleDateSelected={this.handleDateSelected.bind(this)} />
          </div>
        </div>

        <div className="component-container">
          <DashboardReporting />
        </div>
      </div>
    );
  }
}

export default Dashboard;
