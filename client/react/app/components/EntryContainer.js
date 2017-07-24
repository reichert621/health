import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Entry from './Entry';
import { fetchEntry } from '../helpers/entries';
import './Entry.less';

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
        <div>
          <Link to="/">Back</Link>
        </div>

        <Entry
          key={entry.id}
          entry={entry} />

        <div>
          <Link to={`/edit/${entry.id}`}>
            Edit
          </Link>
        </div>
      </div>
    );
  }
}

export default EntryContainer;
