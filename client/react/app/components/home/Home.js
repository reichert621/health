import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import EntryPreview from '../entry/EntryPreview';
import { fetchEntries } from '../../helpers/entries';
import { logout } from '../../helpers/auth';
import './Home.less';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchEntries()
      .then(entries => this.setState({ entries }))
      .catch(err => {
        console.log('Error fetching entries!', err);

        return history.push('/login');
      });
  }

  renderEntries() {
    const { entries = [] } = this.state;

    if (!entries || !entries.length) {
      return (
        <div>Loading entries...</div>
      );
    }

    return entries
      // sort by most recent id
      .sort((x, y) => y.id - x.id)
      .map(entry => (
        <EntryPreview
          key={entry.id}
          entry={entry} />
      ));
  }

  logout() {
    const { history } = this.props;

    return logout()
      .then(res => {
        return history.push('/login');
      })
      .catch(err => {
        console.log('Error logging out!', err);
      });
  }

  render() {
    return (
      <div className="default-container">
        <div className="">
          <Link to="/new">New Entry</Link>
          <span>/</span>
          <Link to="/scorecards">Scorecards</Link>
          <span>/</span>
          <Link to="/checklists">Checklists</Link>
          <span>/</span>
          <Link to="/reporting">Reporting</Link>
          <span>/</span>
          <Link to="/dashboard">Dashboard</Link>
          <span>/</span>
          <Link to="/logout" onClick={this.logout.bind(this)}>
            Logout
          </Link>
        </div>

        <hr />

        <h1 className="blog-title">
          Log
        </h1>

        <div className="entry-list-container">
          {this.renderEntries()}
        </div>

        <hr />

        <div className="">
          <Link to="/new">New Entry</Link>
          <span>/</span>
          <Link to="/scorecards">Scorecards</Link>
          <span>/</span>
          <Link to="/checklists">Checklists</Link>
          <span>/</span>
          <Link to="/reporting">Reporting</Link>
          <span>/</span>
          <Link to="/dashboard">Dashboard</Link>
          <span>/</span>
          <Link to="/logout" onClick={this.logout.bind(this)}>
            Logout
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
