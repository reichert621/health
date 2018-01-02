import React from 'react';
import { Link } from 'react-router-dom';
import DashboardScoreCards from './DashboardScoreCards';
import DashboardCheckLists from './DashboardCheckLists';
import DashboardReporting from './DashboardReporting';
import { isAuthenticated } from '../../helpers/auth';
import './Dashboard.less';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const { history } = this.props;
    // TODO: handle this at higher level, don't want to validate
    // that a user is authenticated in every protected component
    return isAuthenticated()
      .then(isLoggedIn => {
        if (isLoggedIn) {
          return this.setState({ isLoading: false });
        } else {
          return history.push('/login');
        }
      })
      .catch(err => {
        console.log('Error authenticated user!', err);
      });
  }

  render() {
    const { isLoading } = this.state;
    const limit = 5;
    const style = {
      display: 'inline-block',
      width: '48%'
    };

    if (isLoading) {
      return (
        <div className="hidden">TODO: handle loading better</div>
      );
    }

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
