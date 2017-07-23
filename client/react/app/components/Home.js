import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import EntryPreview from './EntryPreview';
import { fetchEntries } from '../helpers/entries';
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

        return history.push('/login')
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

  render() {
    return (
      <div className="blog-container">
        <h1 className="blog-title">
          Log
        </h1>

        <div className="entry-list-container">
          {this.renderEntries()}
        </div>

        <hr />

        <div className="">
          <Link to="/new">New Entry</Link>
        </div>
      </div>
    );
  }
}

export default Home;
