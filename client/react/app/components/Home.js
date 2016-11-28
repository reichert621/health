import React, { PropTypes } from 'react';
import Entry from './Entry'

class Home extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  renderEntries() {
    return entries()
      .map(entry => (
        <Entry
          key={entry._id}
          entry={entry} />
      ));
  }

  render() {
    return (
      <div className='container'>
        <h1>{this.props.title}</h1>

        <ul>{this.renderEntries()}</ul>
      </div>
    );
  }
}

// Test data
function entries() {
  return [
    { _id: 1, author: 'Alex', content: 'Test Entry #1' },
    { _id: 2, author: 'Alex', content: 'Test Entry #2' },
    { _id: 3, author: 'Alex', content: 'Test Entry #3' },
    { _id: 4, author: 'Alex', content: 'Test Entry #4' },
    { _id: 5, author: 'Alex', content: 'Test Entry #5' }
  ];
}

export default Home;
