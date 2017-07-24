import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Entry from './Entry';
import { fetchUserEntries } from '../helpers/entries';
import './Home.less';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    const { match } = this.props;
    const { username } = match.params;

    this.state = {
      user: username,
      entries: []
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { username } = match.params;

    return fetchUserEntries(username)
      .then(entries => this.setState({ entries }))
      .catch(err => {
        console.log('Error fetching user entries!', err);
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
        <Entry
          key={entry.id}
          entry={entry} />
      ));
  }

  render() {
    return (
      <div className="blog-container">
        <h1 className="blog-title">
          {this.state.user}
        </h1>

        <div className="entry-list-container">
          {this.renderEntries()}
        </div>
      </div>
    );
  }
}

export default Profile;
