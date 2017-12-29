import React from 'react';
import { Link } from 'react-router-dom';
import DashboardScoreCards from './DashboardScoreCards';
import DashboardCheckLists from './DashboardCheckLists';
import DashboardReporting from './DashboardReporting';
import './Dashboard.less';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    // TODO: should data be fetched here or in child container components?
  }

  render() {
    const limit = 5;
    const style = {
      display: 'inline-block',
      width: '48%'
    };

    return (
      <div className="default-container">
        <h1>Dashboard</h1>

        <div className="clearfix">
          <div style={style} className="component-container pull-left">
            <DashboardScoreCards limit={limit} />
          </div>

          <div style={style} className="component-container pull-right">
            <DashboardCheckLists limit={limit} />
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
