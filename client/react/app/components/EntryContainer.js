import React, { PropTypes } from 'react';
import Entry from './Entry';
import { fetchEntry } from '../helpers/entries';

class EntryContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entry: {}
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;

    return fetchEntry(id)
      .then(entry =>
        this.setState({ entry }));
  }

  render() {
    const { entry } = this.state;

    if (!entry) {
      return (
        <div>Loading entry...</div>
      );
    }

    return (
      <div className="entry-container">
        <Entry
          key={entry.id}
          isPreview={false}
          entry={entry} />
      </div>
    );
  }
}

export default EntryContainer;
