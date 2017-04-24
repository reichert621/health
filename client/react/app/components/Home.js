import React, { PropTypes } from 'react';
import Entry from './Entry';
import { fetchEntries } from '../helpers/entries';

class Home extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    return fetchEntries()
      .then(entries =>
        this.setState({ entries }));
  }

  renderEntries() {
    const { entries = [] } = this.state;

    if (entries.length) {
      return entries.map(entry => (
        <Entry
          key={entry.id}
          entry={entry} />
      ));
    } else {
      return (
        <div>Loading entries...</div>
      );
    }
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
      </div>
    );
  }
}

export default Home;
