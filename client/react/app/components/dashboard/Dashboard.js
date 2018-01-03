import React from 'react';
import { times, extend } from 'lodash';
import moment from 'moment';
import { all } from 'bluebird';
import DashboardReporting from './DashboardReporting';
import DashboardList from './DashboardList';
import DashboardPreview from './DashboardPreview';
import { fetchScorecards, fetchScorecard } from '../../helpers/scorecard';
import { fetchChecklists } from '../../helpers/checklist';
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

  render() {
    const { scorecards, checklists, selected } = this.state;
    const dates = getPastDates();

    return (
      <div className="default-container">
        <h1>Dashboard</h1>

        <div className="clearfix">
          <div className="dashboard-preview-container pull-left">
            <DashboardPreview selected={selected} />
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
