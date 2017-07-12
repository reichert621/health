import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { createEntry } from '../helpers/entries';

class NewEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      content: ''
    };
  }

  handleSubmit(e) {
    const params = this.state;
    const { history } = this.props;

    return createEntry(params)
      .then(entry =>
        history.push(`/entry/${entry.id}`));
  }

  render() {
    return (
      <div className="new-entry-container">
        <div>
          <Link to="/">Back</Link>
        </div>

        <h1 className="entry-title">
          New Entry
        </h1>

        <input
          type="text"
          className="new-entry-title"
          placeholder="Title"
          value={this.state.title}
          onChange={
            (e) => this.setState({ title: e.target.value })
          } />

        <textarea
          rows="8"
          className="new-entry-content"
          placeholder="Content..."
          value={this.state.content}
          onChange={
            (e) => this.setState({ content: e.target.value })
          }>
        </textarea>

        <button
          className="new-entry-submit"
          onClick={this.handleSubmit.bind(this)}>
          Submit
        </button>
      </div>
    );
  }
}

export default NewEntry;
